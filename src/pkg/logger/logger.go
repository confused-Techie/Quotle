package logger

import (
	"log"
	//"context"
	"os"
	//"cloud.google.com/go/logging"
)

var (
	// WarningLogger logs to the generic log file, prefixed with WARNING:
	WarningLogger *log.Logger
	// InfoLogger logs to the generic log file, prefixed with INFO:
	InfoLogger *log.Logger
	// ErrorLogger logs to the generic log file, prefixed with ERROR:
	ErrorLogger *log.Logger
	// CronLogger logs to the generic log file, prefixed with CRON:
	CronLogger *log.Logger
	// LangLogger logs to the telementy log file, prefixed with LANGUAGE:
	LangLogger *log.Logger
)

func init() {

	//if viper.GetBool("app.production") {
		//ctx := context.Background()

		//projectID := "quotle-348800"

		//client, err := logging.NewClient(ctx, projectID)

		//if err != nil {
		//	log.Fatalf("Failed to create logging client: %v", err)
		//}
		//defer client.Close()

		//logBasic := "logs"
		//logLang := "logs-tlmy"

		//InfoLogger = client.Logger(logBasic).StandardLogger(logging.Info)
		//WarningLogger = client.Logger(logBasic).StandardLogger(logging.Warning)
		//ErrorLogger = client.Logger(logBasic).StandardLogger(logging.Error)
		//CronLogger = client.Logger(logBasic).StandardLogger(logging.Notice)

		//LangLogger = client.Logger(logLang).StandardLogger(logging.Info)

		InfoLogger = log.New(os.Stdout, "INFO: ", log.Ldate|log.Ltime|log.Lshortfile)
		WarningLogger = log.New(os.Stdout, "WARNING: ", log.Ldate|log.Ltime|log.Lshortfile)
		ErrorLogger = log.New(os.Stdout, "ERROR: ", log.Ldate|log.Ltime|log.Lshortfile)
		CronLogger = log.New(os.Stdout, "CRON: ", log.Ldate|log.Ltime|log.LstdFlags)
		LangLogger = log.New(os.Stdout, "LANGUAGE: ", log.Ldate|log.Ltime|log.Lshortfile)
		// The below has been excluded as a hail mary to deploy on the day I wanted. Keeps trying to open the logs file on the read only filesystem
		// of cloud run. Quite rude if you ask me as it causes it to crash on startup.
	//} else {

	//	file, err := os.OpenFile("logs.txt", os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0666)
	//	if err != nil {
	//		log.Fatal(err)
	//	}

	//	tlmyFile, err := os.OpenFile("logs-tlmy.txt", os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0666)
	//	if err != nil {
	//		log.Fatal(err)
	//	}

	//	InfoLogger = log.New(file, "INFO: ", log.Ldate|log.Ltime|log.Lshortfile)
	//	WarningLogger = log.New(file, "WARNING: ", log.Ldate|log.Ltime|log.Lshortfile)
	//	ErrorLogger = log.New(file, "ERROR: ", log.Ldate|log.Ltime|log.Lshortfile)
	//	CronLogger = log.New(file, "CRON: ", log.Ldate|log.Ltime|log.LstdFlags)

	//	LangLogger = log.New(tlmyFile, "LANGUAGE: ", log.Ldate|log.Ltime|log.Lshortfile)

	//}

}

func main() {
	InfoLogger.Println("Starting Quotle...")
}
