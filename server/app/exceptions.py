from fastapi import HTTPException
from typing import Any, Dict, Optional, Sequence


class InvalidCredentials(HTTPException):
    def __init__(self, detail: Any = None,
                 headers: Optional[Dict[str, Any]] = None):
        super().__init__(401, detail, headers)


class AuthenticationException(HTTPException):
    def __init__(self, detail: Any = None,
                 headers: Optional[Dict[str, Any]] = None):
        super().__init__(403, detail, headers)
