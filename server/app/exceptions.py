from fastapi import HTTPException
from typing import Any, Dict, Optional, Sequence


class UnauthorizedException(HTTPException):
    def __init__(self, detail: Any = None,
                 headers: Optional[Dict[str, Any]] = None):
        super().__init__(401, detail, headers)


class ForbiddenException(HTTPException):
    def __init__(self, detail: Any = None,
                 headers: Optional[Dict[str, Any]] = None):
        super().__init__(403, detail, headers)


class BadRequestException(HTTPException):
    def __init__(self, detail: Any = None,
                 headers: Optional[Dict[str, Any]] = None):
        super().__init__(400, detail, headers)


class NotFoundException(HTTPException):
    def __init__(self, detail: Any = None,
                 headers: Optional[Dict[str, Any]] = None):
        super().__init__(404, detail, headers)
