from copy import deepcopy

import pytest
from fastapi import HTTPException
from fastapi.testclient import TestClient

from app.main import app
from app.store import Snapshot, get_store


class MemoryStore:
    def __init__(self):
        self.snapshot = Snapshot()

    async def reserve_ai_attempt(self):
        pass

    async def load(self):
        return deepcopy(self.snapshot)

    async def save(self, snapshot):
        if snapshot.revision != self.snapshot.revision:
            raise HTTPException(409, "data sudah berubah")
        self.snapshot = deepcopy(snapshot)
        self.snapshot.revision += 1
        return self.snapshot.revision


@pytest.fixture
def store():
    return MemoryStore()


@pytest.fixture
def client(store):
    app.dependency_overrides[get_store] = lambda: store
    with TestClient(app) as client:
        yield client
    app.dependency_overrides.clear()
