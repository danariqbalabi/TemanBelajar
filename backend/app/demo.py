"""Original, reviewed sample text. Demo results never represent real learners."""
from app.schemas import Material


FOTOSINTESIS = Material.model_validate({
    "id": "demo-fotosintesis", "title": "Fotosintesis dan peran cahaya",
    "subject": "IPA", "is_demo": True,
    "sources": [
        {"id": "cahaya", "label": "Materi contoh · peran cahaya", "text":
         "Fotosintesis menggunakan energi cahaya untuk membantu tumbuhan membuat gula dari air dan karbon dioksida. Oksigen dilepaskan dalam proses ini. Cahaya memasok energi; cahaya bukan bahan yang berubah menjadi gula."},
        {"id": "klorofil", "label": "Materi contoh · klorofil", "text":
         "Klorofil adalah pigmen yang menyerap energi cahaya. Pada tumbuhan, klorofil terdapat di kloroplas. Akar menyerap air, sedangkan karbon dioksida masuk ke daun melalui stomata. Gula yang terbentuk dapat digunakan tumbuhan sebagai sumber energi dan bahan pertumbuhan."},
    ],
    "concepts": [
        {"id": "peran-cahaya", "title": "Peran cahaya", "source_ids": ["cahaya"],
         "estimated_minutes": 5,
         "paragraphs": ["Tumbuhan memakai energi cahaya saat melakukan fotosintesis.",
                        "Air dan karbon dioksida digunakan untuk membentuk gula. Proses ini juga menghasilkan oksigen."],
         "diagram_description": "Cahaya menuju daun sebagai sumber energi. Air masuk dari akar ke daun. Karbon dioksida masuk ke daun. Dari proses fotosintesis di daun, terbentuk gula dan dilepaskan oksigen.",
         "transcript": "Cahaya menyediakan energi untuk fotosintesis. Tumbuhan menggunakan air dan karbon dioksida untuk membuat gula, serta melepaskan oksigen."},
        {"id": "peran-klorofil", "title": "Peran klorofil", "source_ids": ["klorofil"],
         "estimated_minutes": 5, "prerequisites": ["peran-cahaya"],
         "paragraphs": ["Klorofil membantu menyerap energi cahaya. Pigmen ini terdapat di kloroplas.",
                        "Air diserap akar dan karbon dioksida masuk melalui stomata pada daun."],
         "transcript": "Klorofil menyerap energi cahaya. Air diserap akar, dan karbon dioksida masuk melalui stomata."},
    ],
    "questions": [
        {"id": "cahaya-1", "concept_id": "peran-cahaya", "prompt": "Apa peran cahaya dalam fotosintesis?",
         "options": ["Memberikan energi", "Menggantikan air", "Menjadi akar"], "correct_index": 0,
         "explanation": "Cahaya memberikan energi untuk proses fotosintesis.", "source_ids": ["cahaya"]},
        {"id": "cahaya-2", "concept_id": "peran-cahaya", "prompt": "Bahan apa yang digunakan untuk membentuk gula?",
         "options": ["Oksigen dan tanah", "Air dan karbon dioksida", "Cahaya dan oksigen"], "correct_index": 1,
         "explanation": "Tumbuhan menggunakan air dan karbon dioksida, dengan bantuan energi cahaya.", "source_ids": ["cahaya"]},
        {"id": "klorofil-1", "concept_id": "peran-klorofil", "prompt": "Apa fungsi klorofil?",
         "options": ["Menyerap energi cahaya", "Menyerap tanah", "Menghasilkan akar"], "correct_index": 0,
         "explanation": "Klorofil adalah pigmen yang menyerap energi cahaya.", "source_ids": ["klorofil"]},
    ],
})

DEMO_MATERIALS = {FOTOSINTESIS.id: FOTOSINTESIS}
