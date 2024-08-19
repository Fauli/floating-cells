package utils

import "go.uber.org/zap"

var Logger *zap.Logger

func InitializeLogger() {
	if IsDebug() {
		Logger, _ = zap.NewDevelopment()
		return
	}
	Logger, _ = zap.NewProduction()
}
