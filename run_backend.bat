@echo off
title Kafka Order Processing - Spring Boot Backend
echo ================================================================
echo Starting Spring Boot Backend (Port 8080)...
echo ================================================================
cd /d "%~dp0backend"
set MAVEN_OPTS=-Xmx384m -Xms64m
set _JAVA_OPTIONS=-Xmx384m -Xms64m
call .\mvnw.cmd spring-boot:run
pause
