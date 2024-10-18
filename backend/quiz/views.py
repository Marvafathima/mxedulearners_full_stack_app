from django.shortcuts import render
from datetime import timedelta
from django.http import HttpResponse
from courses.models import Courses
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Quiz,Answer,Question,UserQuizAttempt
from .serializers import *
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework import generics
from django.shortcuts import get_object_or_404
from rest_framework.decorators import action
from django.db.models import Sum
from django.template.loader import get_template
from xhtml2pdf import pisa
from io import BytesIO
from .models import CourseCertificate, Courses, User

class QuizViewSet(viewsets.ModelViewSet):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        data = serializer.data
        
        # Fetch questions and answers
        questions = Question.objects.filter(quiz=instance).prefetch_related('answers')
        question_data = []
        for question in questions:
            q_serializer = QuestionSerializer(question)
            q_data = q_serializer.data
            q_data['answers'] = [{'id': answer.id, 'text': answer.text} for answer in question.answers.all()]
            question_data.append(q_data)
        
        data['questions'] = question_data
        return Response(data)
    # def create(self, request, *args, **kwargs):
    #     data = request.data

    #     # Handle course
    #     course_id = data.get('courseId')
    #     course = get_object_or_404(Courses, id=course_id)

    #     # Handle time limit
    #     hours = int(data.get('timeLimit[hours]', 0))
    #     minutes = int(data.get('timeLimit[minutes]', 0))
    #     seconds = int(data.get('timeLimit[seconds]', 0))
    #     time_limit_duration = timedelta(hours=hours, minutes=minutes, seconds=seconds)

    #     # Create quiz
    #     quiz = Quiz.objects.create(
    #         title=data.get('title'),
    #         description=data.get('description'),
    #         course=course,
    #         creator=self.request.user,
    #         time_limit=time_limit_duration
    #     )

    #     # Process questions
    #     question_count = 0
    #     while f'questions[{question_count}][question]' in data:
    #         question_data = {
    #             'text': data.get(f'questions[{question_count}][question]'),
    #             'marks': int(data.get(f'questions[{question_count}][marks]', 0)),
    #             'negative_marks': float(data.get(f'questions[{question_count}][negativeMarks]', 0)),
    #         }
            
    #         if question_data['text']:  # Only create question if text is not empty
    #             question = Question.objects.create(quiz=quiz, **question_data)

    #             # Process options
    #             option_count = 0
    #             options = []
    #             while f'questions[{question_count}][options][{option_count}]' in data:
    #                 option_text = data.get(f'questions[{question_count}][options][{option_count}]')
    #                 if option_text:  # Only add option if text is not empty
    #                     options.append(option_text)
    #                 option_count += 1

    #             correct_option = int(data.get(f'questions[{question_count}][correctOption]', 0))

    #             for i, option_text in enumerate(options):
    #                 Answer.objects.create(
    #                     question=question,
    #                     text=option_text,
    #                     is_correct=(i == correct_option)
    #                 )

    #         question_count += 1

    #     serializer = self.get_serializer(quiz)
    #     return Response(serializer.data, status=status.HTTP_201_CREATED)
    def create(self, request, *args, **kwargs):
        data = request.data

        # Handle course
        course_id = data.get('courseId')
        course = get_object_or_404(Courses, id=course_id)

        # Check if a quiz already exists for this course and user
        existing_quiz = Quiz.objects.filter(course=course, creator=self.request.user).first()
        if existing_quiz:
            return Response(
                {"error": "A quiz already exists for this course."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Handle time limit
        hours = int(data.get('timeLimit[hours]', 0))
        minutes = int(data.get('timeLimit[minutes]', 0))
        seconds = int(data.get('timeLimit[seconds]', 0))
        time_limit_duration = timedelta(hours=hours, minutes=minutes, seconds=seconds)

        # Create quiz
        quiz = Quiz.objects.create(
            title=data.get('title'),
            description=data.get('description'),
            course=course,
            creator=self.request.user,
            time_limit=time_limit_duration
        )

        # Process questions
        question_count = 0
        while f'questions[{question_count}][question]' in data:
            question_data = {
                'text': data.get(f'questions[{question_count}][question]'),
                'marks': int(data.get(f'questions[{question_count}][marks]', 0)),
                'negative_marks': float(data.get(f'questions[{question_count}][negativeMarks]', 0)),
            }
            
            if question_data['text']:  # Only create question if text is not empty
                question = Question.objects.create(quiz=quiz, **question_data)

                # Process options
                option_count = 0
                options = []
                while f'questions[{question_count}][options][{option_count}]' in data:
                    option_text = data.get(f'questions[{question_count}][options][{option_count}]')
                    if option_text:  # Only add option if text is not empty
                        options.append(option_text)
                    option_count += 1

                correct_option = int(data.get(f'questions[{question_count}][correctOption]', 0))

                for i, option_text in enumerate(options):
                    Answer.objects.create(
                        question=question,
                        text=option_text,
                        is_correct=(i == correct_option)
                    )

            question_count += 1

        serializer = self.get_serializer(quiz)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    

    @action(detail=True, methods=['post'])
    def start(self, request, pk=None):
        quiz = self.get_object()
        attempt = UserQuizAttempt.objects.create(
            user=request.user,
            quiz=quiz,
            score=0
        )
        return Response(UserQuizAttemptSerializer(attempt).data)
    @action(detail=True, methods=['post'])
    def submit(self, request, pk=None):
        print(request.data)
        quiz = self.get_object()
        print(quiz.id)
        print(quiz.course.name)
        # Check if user already has an attempt for this quiz
        attempt = UserQuizAttempt.objects.filter(user=request.user, quiz=quiz).first()

        if attempt:
            # Check if user has reached the maximum number of attempts or has already passed
            if attempt.totalattempts >= 2:
                return Response({'error': 'You have reached the maximum number of attempts for this quiz.'}, 
                                status=status.HTTP_400_BAD_REQUEST)
            if attempt.passed:
                return Response({'error': 'You have already passed this quiz.'}, 
                                status=status.HTTP_400_BAD_REQUEST)
        
            if attempt.totalattempts<2:
                new_score = 0
                for quizzes, selected_answer in request.data.items():
                    for question_id, answer_id in selected_answer.items():
                        try:
                            question = Question.objects.get(id=int(question_id), quiz=quiz)
                            correct_answer = Answer.objects.get(question=question, is_correct=True)

                            if correct_answer.id == int(answer_id):
                                new_score += question.marks
                            else:
                                new_score -= question.negative_marks
                        except Question.DoesNotExist:
                            return Response({'error': f'Invalid question ID: {question_id}'}, 
                                            status=status.HTTP_400_BAD_REQUEST)
                        except Answer.DoesNotExist:
                            return Response({'error': f'No correct answer found for question ID: {question_id}'}, 
                                            status=status.HTTP_400_BAD_REQUEST)

                # Calculate total marks for the quiz
                total_marks = Question.objects.filter(quiz=quiz).aggregate(total_marks=Sum('marks'))['total_marks']
                new_percentage = (new_score / total_marks) * 100 if total_marks else 0

                # Update the attempt only if the new score is higher
                if new_score > attempt.score:
                    attempt.score = new_score
                    attempt.percentage = new_percentage
                    attempt.passed = new_percentage >= 40

                # Save the attempt
                attempt.save()

                return Response({
                    'score': attempt.score, 
                    'percentage': attempt.percentage,
                    'attempts': attempt.totalattempts,
                    'passed': attempt.passed
                }, status=status.HTTP_200_OK)
        
        else:
            # Create a new attempt if one doesn't exist
            attempt = UserQuizAttempt.objects.create(
                user=request.user,
                quiz=quiz,
                passed=False,
                score=0,
                totalattempts=0
            )

        # Increment the total attempts
        attempt.totalattempts += 1

        new_score = 0
        for quizzes, selected_answer in request.data.items():
            for question_id, answer_id in selected_answer.items():
                try:
                    question = Question.objects.get(id=int(question_id), quiz=quiz)
                    correct_answer = Answer.objects.get(question=question, is_correct=True)

                    if correct_answer.id == int(answer_id):
                        new_score += question.marks
                    else:
                        new_score -= question.negative_marks
                except Question.DoesNotExist:
                    return Response({'error': f'Invalid question ID: {question_id}'}, 
                                    status=status.HTTP_400_BAD_REQUEST)
                except Answer.DoesNotExist:
                    return Response({'error': f'No correct answer found for question ID: {question_id}'}, 
                                    status=status.HTTP_400_BAD_REQUEST)

        # Calculate total marks for the quiz
        total_marks = Question.objects.filter(quiz=quiz).aggregate(total_marks=Sum('marks'))['total_marks']
        new_percentage = (new_score / total_marks) * 100 if total_marks else 0

        # Update the attempt only if the new score is higher
        if new_score > attempt.score:
            attempt.score = new_score
            attempt.percentage = new_percentage
            attempt.passed = new_percentage >= 40

        # Save the attempt
        attempt.save()
        if attempt.passed and not CourseCertificate.objects.filter(user=request.user, course=quiz.course).exists():
            CourseCertificate.objects.create(user=request.user, course=quiz.course)
            print(request.user,quiz.course.id)
            # generate_certificate(request.user,quiz.course.id)
        # You might want to call generate_certificate here or redirect to it

        return Response({
            'score': attempt.score, 
            'percentage': attempt.percentage,
            'attempts': attempt.totalattempts,
            'passed': attempt.passed
        }, status=status.HTTP_200_OK)
   

from rest_framework.viewsets import ModelViewSet
from django.db import transaction

class EditQuizView(generics.UpdateAPIView):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'
    @transaction.atomic
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        
        # Check if the user is the creator of the quiz
        if instance.creator != request.user:
            return Response({"detail": "You do not have permission to edit this quiz."}, 
                            status=status.HTTP_403_FORBIDDEN)

        # Update Quiz fields
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        # Handle Questions
        if 'questions' in request.data:
            existing_question_ids = set(instance.questions.values_list('id', flat=True))
            updated_question_ids = set()

            for question_data in request.data['questions']:
                question_id = question_data.get('id')
                
                if question_id:
                    # Update existing question
                    question = Question.objects.get(id=question_id, quiz=instance)
                    question_serializer = QuestionSerializer(question, data=question_data, partial=True)
                else:
                    # Create new question
                    question_serializer = QuestionSerializer(data=question_data)

                question_serializer.is_valid(raise_exception=True)
                question = question_serializer.save(quiz=instance)
                updated_question_ids.add(question.id)

                # Handle Answers/Options
                if 'options' in question_data:
                    existing_answer_ids = set(question.answers.values_list('id', flat=True))
                    updated_answer_ids = set()

                    for answer_data in question_data['options']:
                        answer_id = answer_data.get('id')
                        
                        if answer_id:
                            # Update existing answer
                            answer = Answer.objects.get(id=answer_id, question=question)
                            answer_serializer = AnswerSerializer(answer, data=answer_data, partial=True)
                        else:
                            # Create new answer
                            answer_serializer = AnswerSerializer(data=answer_data)

                        answer_serializer.is_valid(raise_exception=True)
                        answer = answer_serializer.save(question=question)
                        updated_answer_ids.add(answer.id)

                    # Delete answers that weren't updated
                    Answer.objects.filter(question=question, id__in=existing_answer_ids - updated_answer_ids).delete()

            # Delete questions that weren't updated
            Question.objects.filter(quiz=instance, id__in=existing_question_ids - updated_question_ids).delete()

        # Re-fetch the updated quiz instance
        updated_instance = self.get_object()
        serializer = self.get_serializer(updated_instance)
        print("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&",serializer.data)
        return Response(serializer.data)
from rest_framework.exceptions import NotFound
class QuestionUpdateView(generics.RetrieveUpdateAPIView):
    queryset = Question.objects.all()
    serializer_class = Question2Serializer
    permission_classes = [IsAuthenticated]
    def get_object(self):
        quiz_id = self.kwargs.get('quiz_id')
        question_id = self.kwargs.get('question_id')

        # Ensure the question exists and belongs to the correct quiz
        try:
            question = Question.objects.get(id=question_id, quiz_id=quiz_id)
        except Question.DoesNotExist:
            raise NotFound(detail="Question not found or does not belong to this quiz.")

        return question
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        print("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&",serializer.data)
        user = self.request.user
        courses = Courses.objects.filter(user=user)
        quizzes = Quiz.objects.filter(course__in=courses)

        # Serialize the list of quizzes
        quiz_serializer = QuizSerializer(quizzes, many=True)

        # Return the updated list of quizzes
        return Response(quiz_serializer.data)
        # return Response(serializer.data)

    def perform_update(self, serializer):
        serializer.save()

    def get_queryset(self):
        return Question.objects.filter(quiz__creator=self.request.user) 
class QuestionViewSet(ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer

    @action(detail=True, methods=['post'])
    def answer(self, request, pk=None):
        question = self.get_object()
        answer_id = request.data.get('answerId')
        
        try:
            answer = Answer.objects.get(id=answer_id, question=question)
            return Response({
                'questionId': question.id,
                'answerId': answer.id,
                'isCorrect': answer.is_correct
            })
        except Answer.DoesNotExist:
            return Response({'error': 'Invalid answer'}, status=status.HTTP_400_BAD_REQUEST)

from django.db.models import Exists, OuterRef

class CourseQuizzesView(generics.ListAPIView):
    serializer_class = QuizSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        course_id = self.kwargs['course_id']
        user = self.request.user

        # Subquery to check if a UserQuizAttempt exists for each quiz
        attempt_exists = UserQuizAttempt.objects.filter(
            user=user,
            quiz=OuterRef('pk')
        )

        # Get all quizzes for the course, annotated with attempt information
        quizzes = Quiz.objects.filter(course_id=course_id).annotate(
            has_attempt=Exists(attempt_exists),
            attempt_count=Exists(attempt_exists.filter(totalattempts__gte=2)),
            is_passed=Exists(attempt_exists.filter(passed=True))
        )
        print("\n\n\n\n777777777777777",quizzes)
        return quizzes

    def list(self, request, *args, **kwargs):
        
        queryset = self.get_queryset()
        result = []

        for quiz in queryset:
            if not quiz.has_attempt:
                # Quiz hasn't been attempted yet
                result.append(self.get_serializer(quiz).data)
            elif quiz.is_passed:
                result.append({
                    'id': quiz.id,
                    'title': quiz.title,
                    'status': 'Quiz passed'
                })
            elif quiz.attempt_count:
                result.append({
                    'id': quiz.id,
                    'title': quiz.title,
                    'status': 'Quiz failed and attempt is over'
                })
            else:
                # Quiz has been attempted but not passed and attempts remain
                result.append(self.get_serializer(quiz).data)
                print("\n\n\n\n777777777777777",result)
        return Response(result)
       
def generate_certificate(request, user_id, course_id):
    user = get_object_or_404(User, id=user_id)
    print(user)
    course = get_object_or_404(Courses, id=course_id)
    print(course,"yses course fetched")
    quiz=get_object_or_404(Quiz,course=course)
    print("yes uiz fetched",quiz.id,user.id)
    attempt=UserQuizAttempt.objects.filter(user_id=user_id,quiz_id=quiz.id).first()
    print("attempt is here",attempt.percentage,attempt.score)
    # Check if certificate already exists
    certificate, created = CourseCertificate.objects.get_or_create(
        user=user,
        course=course,
        percentage_score=attempt.percentage
    )

    # Prepare context for the certificate template
    context = {
        'user_name': f"{user.username}",
        'course_name': course.name,
        'date': certificate.created_at.strftime("%B %d, %Y"),
        'certificate_id': certificate.id
    }

    # Get the certificate template
    template = get_template('certificate_template.html')
    html = template.render(context)

    # Create a PDF
    result = BytesIO()
    pdf = pisa.pisaDocument(BytesIO(html.encode("UTF-8")), result)

    if not pdf.err:
        response = HttpResponse(result.getvalue(), content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="certificate_{user.id}_{course.id}.pdf"'
        return response
    else:
        return HttpResponse('Error generating PDF', status=400)


class QuizListView(generics.ListAPIView):
    serializer_class = QuizSerializer
    permission_classes=[IsAuthenticated]
    def get_queryset(self):
        # Get the current user
        user = self.request.user

        # Get the courses created by the current user
        courses = Courses.objects.filter(user=user)

        # Filter the quizzes based on the courses created by the user
        return Quiz.objects.filter(course__in=courses)