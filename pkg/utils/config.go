package utils

import (
	"fmt"
	"os"
)

const (
	adminEmail    = "aaaaaaaa@aaaaaaaa.ch"
	connString    = "host=localhost port=5432 user=banague password=banaguePassword! dbname=baby_names sslmode=disable"
	eventPassword = "mantis-shrimp"
	twint         = "0796661337"
	paypal        = "mail@domain.com"
	sessionKey    = "secret-session-key-1337!"
	uiPath        = "/game/"
	serverAndPort = "localhost:8080"
	IBAN          = "CH1234567890123456789"
)

// GetAdminEmail returns the email address of the admin.
func GetAdminEmail() string {
	return GetEnv("ADMIN_EMAIL", adminEmail)
}

// GetDatabaseConnectionString returns the connection string for the database.
func GetDatabaseConnectionString() string {
	return GetEnv("DATABASE_URL", connString)
}

// GetEventPassword returns the password for the event.
func GetEventPassword() string {
	return GetEnv("EVENT_PASSWORD", eventPassword)
}

func GetMobile() string {
	return GetEnv("TWINT", twint)
}

func GetPaypal() string {
	return GetEnv("PAYPAL", paypal)
}

func GetIBAN() string {
	return GetEnv("IBAN", IBAN)
}

func GetSessionKey() string {
	return GetEnv("SESSION_KEY", sessionKey)
}

func IsDebug() bool {
	return GetEnv("BANAGUE_DEBUG", "false") == "true"
}

func GetUIPath() string {
	return GetEnv("UI_PATH", uiPath)
}

func GetServerAndPort() string {
	return GetEnv("SERVER_AND_PORT", serverAndPort)
}

// GetEnv returns the value of an environment variable or a fallback value if the variable is not set.
func GetEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}

func PrintAllConfig() {
	fmt.Println("Using following configuration:")
	fmt.Printf("ADMIN_EMAIL: %s\n", GetAdminEmail())
	fmt.Printf("DATABASE_URL: %s\n", GetDatabaseConnectionString())
	fmt.Printf("EVENT_PASSWORD: %s\n", GetEventPassword())
	fmt.Printf("TWINT: %s\n", GetMobile())
	fmt.Printf("PAYPAL: %s\n", GetPaypal())
	fmt.Printf("IBAN: %s\n", GetIBAN())
	fmt.Printf("SESSION_KEY: %s\n", GetSessionKey())
	fmt.Printf("BANAGUE_DEBUG: %t\n", IsDebug())
	fmt.Printf("UI_PATH: %s\n", GetUIPath())
	fmt.Printf("SERVER_AND_PORT: %s\n", GetServerAndPort())
}
