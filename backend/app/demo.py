"""Original, reviewed sample text. Demo results never represent real learners."""

from app.schemas import Material

FOTOSINTESIS = Material.model_validate(
    {
        "id": "demo-fotosintesis",
        "title": "Fotosintesis dan peran cahaya",
        "subject": "IPA",
        "is_demo": True,
        "sources": [
            {
                "id": "cahaya",
                "label": "Materi contoh · peran cahaya",
                "text": "Fotosintesis menggunakan energi cahaya untuk membantu tumbuhan membuat gula dari air dan karbon dioksida. Oksigen dilepaskan dalam proses ini. Cahaya memasok energi; cahaya bukan bahan yang berubah menjadi gula.",
            },
            {
                "id": "klorofil",
                "label": "Materi contoh · klorofil",
                "text": "Klorofil adalah pigmen yang menyerap energi cahaya. Pada tumbuhan, klorofil terdapat di kloroplas. Akar menyerap air, sedangkan karbon dioksida masuk ke daun melalui stomata. Gula yang terbentuk dapat digunakan tumbuhan sebagai sumber energi dan bahan pertumbuhan.",
            },
        ],
        "concepts": [
            {
                "id": "peran-cahaya",
                "title": "Peran cahaya",
                "source_ids": ["cahaya"],
                "estimated_minutes": 5,
                "paragraphs": [
                    "Tumbuhan memakai energi cahaya saat melakukan fotosintesis.",
                    "Air dan karbon dioksida digunakan untuk membentuk gula. Proses ini juga menghasilkan oksigen.",
                ],
                "diagram_description": "Cahaya menuju daun sebagai sumber energi. Air masuk dari akar ke daun. Karbon dioksida masuk ke daun. Dari proses fotosintesis di daun, terbentuk gula dan dilepaskan oksigen.",
                "transcript": "Cahaya menyediakan energi untuk fotosintesis. Tumbuhan menggunakan air dan karbon dioksida untuk membuat gula, serta melepaskan oksigen.",
            },
            {
                "id": "peran-klorofil",
                "title": "Peran klorofil",
                "source_ids": ["klorofil"],
                "estimated_minutes": 5,
                "prerequisites": ["peran-cahaya"],
                "paragraphs": [
                    "Klorofil membantu menyerap energi cahaya. Pigmen ini terdapat di kloroplas.",
                    "Air diserap akar dan karbon dioksida masuk melalui stomata pada daun.",
                ],
                "transcript": "Klorofil menyerap energi cahaya. Air diserap akar, dan karbon dioksida masuk melalui stomata.",
            },
        ],
        "questions": [
            {
                "id": "cahaya-1",
                "concept_id": "peran-cahaya",
                "prompt": "Apa peran cahaya dalam fotosintesis?",
                "options": ["Memberikan energi", "Menggantikan air", "Menjadi akar"],
                "option_hints": [
                    "Cari sumber energi yang dipakai tumbuhan untuk membuat gula.",
                    "Air tetap diperlukan sebagai bahan pembentuk gula. Perhatikan dari mana energinya berasal.",
                    "Akar adalah bagian tumbuhan. Soal ini menanyakan energi untuk membuat gula.",
                ],
                "correct_index": 0,
                "explanation": "Cahaya memberikan energi untuk proses fotosintesis.",
                "source_ids": ["cahaya"],
            },
            {
                "id": "cahaya-2",
                "concept_id": "peran-cahaya",
                "prompt": "Bahan apa yang digunakan untuk membentuk gula?",
                "options": [
                    "Oksigen dan tanah",
                    "Air dan karbon dioksida",
                    "Cahaya dan oksigen",
                ],
                "option_hints": [
                    "Oksigen dilepas saat fotosintesis. Cari dua bahan yang masuk ke proses itu.",
                    "Cocokkan kedua bahan ini dengan bahan pembentuk gula dalam bacaan.",
                    "Cahaya memberi energi dan oksigen dihasilkan. Cari bahan yang digunakan tumbuhan.",
                ],
                "correct_index": 1,
                "explanation": "Tumbuhan menggunakan air dan karbon dioksida, dengan bantuan energi cahaya.",
                "source_ids": ["cahaya"],
            },
            {
                "id": "klorofil-1",
                "concept_id": "peran-klorofil",
                "prompt": "Apa fungsi klorofil?",
                "options": [
                    "Menyerap energi cahaya",
                    "Menyerap tanah",
                    "Menghasilkan akar",
                ],
                "option_hints": [
                    "Perhatikan apa yang diserap pigmen pada daun.",
                    "Cari hubungan klorofil dengan cahaya yang mengenai daun.",
                    "Pertanyaan menanyakan kerja pigmen saat daun menerima cahaya.",
                ],
                "correct_index": 0,
                "explanation": "Klorofil adalah pigmen yang menyerap energi cahaya.",
                "source_ids": ["klorofil"],
            },
        ],
    }
)

PYTHAGORAS = Material.model_validate(
    {
        "id": "demo-pythagoras",
        "title": "Teorema Pythagoras",
        "subject": "Matematika",
        "is_demo": True,
        "sources": [
            {
                "id": "rumus",
                "label": "Materi contoh · segitiga siku-siku",
                "text": "Pada segitiga siku-siku, a dan b adalah sisi yang membentuk sudut siku-siku. Sisi c berhadapan dengan sudut siku-siku dan disebut hipotenusa. Berlaku a² + b² = c². Jika a = 3 dan b = 4, c² = 9 + 16 = 25 sehingga c = 5. Jika c = 13 dan a = 5, b² = 169 - 25 = 144 sehingga b = 12. Jika a = 6 dan b = 8, c = 10.",
            }
        ],
        "concepts": [
            {
                "id": "teorema-pythagoras",
                "title": "Menghitung sisi segitiga siku-siku",
                "source_ids": ["rumus"],
                "estimated_minutes": 10,
                "skill_id": "math.pythagorean-theorem",
                "paragraphs": [
                    "Tentukan dulu hipotenusa, yaitu sisi di depan sudut siku-siku.",
                    "Gunakan a² + b² = c². Untuk a = 3 dan b = 4, hipotenusanya adalah 5.",
                    "Jika mencari sisi siku-siku, kurangi kuadrat hipotenusa dengan kuadrat sisi lain, lalu ambil akar positifnya.",
                ],
                "diagram_description": "Segitiga siku-siku memiliki dua sisi tegak lurus dengan panjang 3 dan 4 satuan. Sisi yang menghubungkan ujung keduanya adalah hipotenusa sepanjang 5 satuan.",
                "transcript": "Jumlah kuadrat kedua sisi siku-siku sama dengan kuadrat hipotenusa. Tiga kuadrat ditambah empat kuadrat sama dengan dua puluh lima. Akar positif dua puluh lima adalah lima.",
            }
        ],
        "questions": [
            {
                "id": "pythagoras-1",
                "concept_id": "teorema-pythagoras",
                "prompt": "Sisi siku-siku panjangnya 3 dan 4. Berapa panjang hipotenusa?",
                "options": ["5", "7", "25"],
                "option_hints": [
                    "Periksa dengan menghitung 5 kuadrat.",
                    "Kuadratkan 3 dan 4 sebelum menjumlahkannya.",
                    "25 adalah kuadrat hipotenusa. Ambil akarnya untuk memperoleh panjang sisi.",
                ],
                "correct_index": 0,
                "explanation": "c = √(3² + 4²) = √25 = 5.",
                "source_ids": ["rumus"],
            },
            {
                "id": "pythagoras-2",
                "concept_id": "teorema-pythagoras",
                "prompt": "Hipotenusa 13 dan salah satu sisi siku-siku 5. Berapa sisi siku-siku lainnya?",
                "options": ["8", "12", "18"],
                "option_hints": [
                    "Kurangkan kuadrat kedua panjang sisi sebelum mengambil akar.",
                    "Uji dengan menjumlahkan 12 kuadrat dan 5 kuadrat.",
                    "Panjang sisi siku-siku harus lebih pendek dari hipotenusa 13.",
                ],
                "correct_index": 1,
                "explanation": "b = √(13² - 5²) = √144 = 12.",
                "source_ids": ["rumus"],
            },
            {
                "id": "pythagoras-3",
                "concept_id": "teorema-pythagoras",
                "prompt": "Sisi siku-siku panjangnya 6 dan 8. Berapa panjang hipotenusa?",
                "options": ["14", "100", "10"],
                "option_hints": [
                    "Mulai dengan mengkuadratkan 6 dan 8.",
                    "100 masih berupa kuadrat panjang. Ambil akar positifnya.",
                    "Uji dengan membandingkan 10 kuadrat dengan jumlah kuadrat 6 dan 8.",
                ],
                "correct_index": 2,
                "explanation": "c = √(6² + 8²) = √100 = 10.",
                "source_ids": ["rumus"],
            },
        ],
    }
)

DEMO_MATERIALS = {m.id: m for m in [FOTOSINTESIS, PYTHAGORAS]}

# Worked practice history for one demo course.
MANDA_COURSE_ID = "manda-pythagoras"


def manda_course_history() -> dict:
    material = PYTHAGORAS.model_dump()
    material["id"] = MANDA_COURSE_ID
    material["title"] = "Pythagoras: Mencari Sisi Segitiga"
    for qid, prompt, options, correct, explanation in [
        (
            "manda-4",
            "Sisi 5 dan 12 saling tegak lurus. Berapa panjang hipotenusa?",
            ["13", "17", "169"],
            0,
            "Akar dari 25 + 144 adalah 13.",
        ),
        (
            "manda-5",
            "Hipotenusa 10 dan salah satu kaki 6. Berapa kaki lainnya?",
            ["4", "8", "16"],
            1,
            "Kurangi kuadrat: 100 - 36 = 64. Akar 64 adalah 8.",
        ),
        (
            "manda-6",
            "Hipotenusa 17 dan salah satu kaki 8. Berapa kaki lainnya?",
            ["9", "15", "25"],
            1,
            "Kurangi kuadrat: 289 - 64 = 225. Akar 225 adalah 15.",
        ),
    ]:
        material["questions"].append(
            {
                "id": qid,
                "concept_id": "teorema-pythagoras",
                "prompt": prompt,
                "options": options,
                "correct_index": correct,
                "explanation": explanation,
                "source_ids": ["rumus"],
                "option_hints": {
                    "manda-4": [
                        "Periksa dengan mengkuadratkan 13.",
                        "Jumlahkan kuadrat kedua sisi, lalu ambil akar hasilnya.",
                        "169 adalah kuadrat panjang sisi. Ambil akarnya untuk mendapatkan panjang.",
                    ],
                    "manda-5": [
                        "Gunakan kuadrat panjang sisi sebelum mengurangkan.",
                        "Cek kembali apakah 6 kuadrat ditambah 8 kuadrat sama dengan 10 kuadrat.",
                        "Kaki segitiga harus lebih pendek dari hipotenusa 10.",
                    ],
                    "manda-6": [
                        "Mulai dari 17 kuadrat dikurangi 8 kuadrat, lalu ambil akarnya.",
                        "Uji dengan menjumlahkan kuadrat 15 dan kuadrat 8.",
                        "Sisi yang dicari harus lebih pendek dari hipotenusa 17.",
                    ],
                }[qid],
            }
        )
    answers = {
        q["id"]: {
            "selected_index": selected,
            "correct": selected == q["correct_index"],
            "answered_at": f"2026-01-01T12:00:0{i}+00:00",
        }
        for i, (q, selected) in enumerate(
            zip(material["questions"], [0, 0, 2, 0, 0, 0])
        )
    }
    return {
        "materials": {MANDA_COURSE_ID: material},
        "attempts": {"manda": {"material_id": MANDA_COURSE_ID, "answers": answers}},
        "sessions": {
            "manda": {
                "material_id": MANDA_COURSE_ID,
                "completed_concepts": ["teorema-pythagoras"],
            }
        },
    }


DEMO_MATERIALS[MANDA_COURSE_ID] = Material.model_validate(
    manda_course_history()["materials"][MANDA_COURSE_ID]
)


def with_course_history(data: dict, material_id: str) -> dict:
    if material_id != MANDA_COURSE_ID:
        return data
    sample = manda_course_history()
    return {
        **data,
        "attempts": {**sample["attempts"], **data["attempts"]},
        "sessions": {**sample["sessions"], **data["sessions"]},
    }
