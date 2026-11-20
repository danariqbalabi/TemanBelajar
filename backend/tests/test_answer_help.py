import json
from unittest.mock import AsyncMock

from app import answer_help
from app.config import Settings
from app.demo import FOTOSINTESIS


def test_help_requires_wrong_answer_and_verifies_source(client, store, monkeypatch):
    question = FOTOSINTESIS.questions[0]
    source = next(s for s in FOTOSINTESIS.sources if s.id in question.source_ids)
    store.snapshot.data["attempts"]["saved"] = {
        "material_id": FOTOSINTESIS.id,
        "answers": {},
    }
    answers = store.snapshot.data["attempts"]["saved"]["answers"]
    monkeypatch.setattr(
        answer_help, "settings", lambda: Settings(gemini_api_key="test")
    )
    result = {
        "explanation": ["Kenali bahan fotosintesis.", "Cahaya memberi energi."],
        "source_id": source.id,
        "source_quote": source.text.split(". ")[0],
        "practice": {
            "prompt": "Apa yang dipasok cahaya ke tumbuhan?",
            "options": ["Energi", "Oksigen", "Air"],
            "correct_index": 0,
            "explanation": "Cahaya memasok energi.",
        },
    }
    generate = AsyncMock(return_value=json.dumps(result))
    reserve = AsyncMock()
    monkeypatch.setattr(answer_help, "generate_json", generate)
    monkeypatch.setattr(store, "reserve_ai_attempt", reserve)
    path = f"/v1/attempts/saved/questions/{question.id}/help"
    assert client.post(path, json={"mode": "steps"}).status_code == 422
    answers[question.id] = {"selected_index": question.correct_index, "correct": True}
    assert client.post(path, json={"mode": "steps"}).status_code == 422
    generate.assert_not_called()
    reserve.assert_not_called()

    answers[question.id] = {"selected_index": 1, "correct": False}
    before = store.snapshot.model_dump()
    response = client.post(path, json={"mode": "steps"})
    assert response.status_code == 200, response.text
    assert response.json() == result
    reserve.assert_awaited_once()
    assert question.options[1] in generate.await_args.args[1]
    assert store.snapshot.model_dump() == before

    result["source_quote"] = "Kutipan ini tidak ada pada sumber asli."
    generate.return_value = json.dumps(result)
    assert client.post(path, json={"mode": "simple"}).status_code == 502
