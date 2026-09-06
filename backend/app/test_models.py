from app.models.user import User
from app.models.problem import Problem
from app.models.university import University
from app.models.solution import Solution
from app.models.problem_ai_analysis import ProblemAIAnalysis


print("All models imported successfully!")

print(User.__tablename__)
print(Problem.__tablename__)
print(University.__tablename__)
print(Solution.__tablename__)
print(ProblemAIAnalysis.__tablename__)