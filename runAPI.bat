@echo off
call env\Scripts\activate
uvicorn API:app --host 0.0.0.0 --port 8000 --reload