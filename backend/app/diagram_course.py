"""Reviewed sample course with a matching frontend water-cycle diagram."""

from app.schemas import Material

SIKLUS_AIR = Material.model_validate(
    {
        "id": "demo-siklus-air",
        "title": "Siklus Air: dari Laut ke Hujan",
        "subject": "IPA",
        "is_demo": True,
        "sources": [
            {
                "id": "siklus-air",
                "label": "Materi contoh · siklus air",
                "text": "Energi matahari menguapkan air dari laut, danau, dan sungai. Uap air yang mendingin mengalami kondensasi menjadi titik-titik air pembentuk awan. Ketika titik air membesar dan cukup berat, air jatuh sebagai hujan. Air hujan dapat mengalir di permukaan menuju sungai dan laut, atau meresap ke tanah. Siklus ini berlangsung berulang; air berubah tempat dan wujud, bukan hilang.",
            }
        ],
        "concepts": [
            {
                "id": "perjalanan-air",
                "title": "Empat tahap perjalanan air",
                "source_ids": ["siklus-air"],
                "estimated_minutes": 8,
                "paragraphs": [
                    "1. Penguapan: energi matahari membantu air cair dari laut, danau, dan sungai berubah menjadi uap air.",
                    "2. Kondensasi: uap air mendingin dan berubah menjadi titik-titik air yang membentuk awan.",
                    "3. Hujan: titik-titik air di awan membesar. Ketika cukup berat, air jatuh ke permukaan bumi.",
                    "4. Air kembali: sebagian air mengalir ke sungai dan laut, sebagian meresap ke tanah. Air di permukaan dapat menguap lagi sehingga siklus berulang.",
                ],
                "diagram_description": "Diagram dibaca searah jarum jam: penguapan di kiri atas, kondensasi di kanan atas, hujan di kanan bawah, lalu aliran dan resapan di kiri bawah. Panah kembali ke penguapan menunjukkan siklus berulang. Energi matahari membantu penguapan; sebagian air hujan meresap ke tanah.",
                "transcript": "Ikuti perjalanan air. Pertama, energi matahari membantu air menguap. Kedua, uap yang mendingin membentuk titik-titik air di awan. Ketiga, air jatuh sebagai hujan. Keempat, air mengalir ke sungai dan laut atau meresap ke tanah. Siklus ini terus berulang.",
            }
        ],
        "questions": [
            {
                "id": "air-1",
                "concept_id": "perjalanan-air",
                "prompt": "Apa yang membantu air di laut menguap?",
                "options": [
                    "Energi matahari",
                    "Air berubah menjadi tanah",
                    "Awan menyerap laut",
                ],
                "correct_index": 0,
                "explanation": "Energi matahari membantu air cair berubah menjadi uap air.",
                "source_ids": ["siklus-air"],
            },
            {
                "id": "air-2",
                "concept_id": "perjalanan-air",
                "prompt": "Pada diagram, tahap apa yang membentuk titik-titik air di awan?",
                "options": ["Aliran permukaan", "Kondensasi", "Penguapan"],
                "correct_index": 1,
                "explanation": "Kondensasi terjadi saat uap air mendingin menjadi titik-titik air pembentuk awan.",
                "source_ids": ["siklus-air"],
            },
            {
                "id": "air-3",
                "concept_id": "perjalanan-air",
                "prompt": "Ke mana air dapat pergi setelah jatuh sebagai hujan?",
                "options": [
                    "Seluruhnya hilang",
                    "Selalu langsung menjadi awan",
                    "Mengalir ke sungai dan laut atau meresap ke tanah",
                ],
                "correct_index": 2,
                "explanation": "Air hujan dapat mengalir di permukaan atau meresap ke tanah. Air tidak hilang dari siklus.",
                "source_ids": ["siklus-air"],
            },
        ],
    }
)
