import json

def check_answers(test_json: str, user_answers: dict):
    test = json.loads(test_json)

    correct = 0
    total = len(test["questions"])

    for i, q in enumerate(test["questions"]):
        if user_answers.get(str(i)) == q["answer"]:
            correct += 1

    passed = correct == total

    return {"passed": passed, "correct": correct, "total": total}
