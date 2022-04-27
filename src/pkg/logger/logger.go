package logger

import (
	"log"
	"os"
)

var (
  // WarningLogger logs to the generic log file, prefixed with WARNING:
	WarningLogger *log.Logger
  // InfoLogger logs to the generic log file, prefixed with INFO:
	InfoLogger    *log.Logger
  // ErrorLogger logs to the generic log file, prefixed with ERROR:
	ErrorLogger   *log.Logger
  // CronLogger logs to the generic log file, prefixed with CRON:
	CronLogger    *log.Logger
  // LangLogger logs to the telementy log file, prefixed with LANGUAGE:
	LangLogger    *log.Logger
)

func init() {
	file, err := os.OpenFile("logs.txt", os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0666)
	if err != nil {
		log.Fatal(err)
	}

	tlmyFile, err := os.OpenFile("logs-tlmy.txt", os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0666)
	if err != nil {
		log.Fatal(err)
	}

	InfoLogger = log.New(file, "INFO: ", log.Ldate|log.Ltime|log.Lshortfile)
	WarningLogger = log.New(file, "WARNING: ", log.Ldate|log.Ltime|log.Lshortfile)
	ErrorLogger = log.New(file, "ERROR: ", log.Ldate|log.Ltime|log.Lshortfile)
	CronLogger = log.New(file, "CRON: ", log.Ldate|log.Ltime|log.LstdFlags)

	LangLogger = log.New(tlmyFile, "LANGUAGE: ", log.Ldate|log.Ltime|log.Lshortfile)
}

func main() {
	InfoLogger.Println("Starting Quotle...")
}
