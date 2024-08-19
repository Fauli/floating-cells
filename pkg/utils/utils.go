package utils

import (
	"fmt"
	"net/mail"
)

func IsMailValid(email string) bool {
	_, err := mail.ParseAddress(email)
	return err == nil
}

func MapToSlice(in map[string]int) []KV {
	vec := make([]KV, len(in))
	i := 0
	for k, v := range in {
		vec[i].Key = k
		vec[i].Value = v
		i++
	}
	return vec
}

type KV struct {
	Key   string
	Value int
}

/*
	func ShowSplashScreen prints the below ASCII art to the console.

.______        ___      .__   __.      ___       _______  __    __   _______
|   _  \      /   \     |  \ |  |     /   \     /  _____||  |  |  | |   ____|
|  |_)  |    /  ^  \    |   \|  |    /  ^  \   |  |  __  |  |  |  | |  |__
|   _  <    /  /_\  \   |  . `  |   /  /_\  \  |  | |_ | |  |  |  | |   __|
|  |_)  |  /  _____  \  |  |\   |  /  _____  \ |  |__| | |  `--'  | |  |____
|______/  /__/     \__\ |__| \__| /__/     \__\ \______|  \______/  |_______|
*/
func ShowSplashScreen() {
	splashScreen := `
.______        ___      .__   __.      ___       _______  __    __   _______
|   _  \      /   \     |  \ |  |     /   \     /  _____||  |  |  | |   ____|
|  |_)  |    /  ^  \    |   \|  |    /  ^  \   |  |  __  |  |  |  | |  |__
|   _  <    /  /_\  \   |  . ` + "`" + `  |   /  /_\  \  |  | |_ | |  |  |  | |   __|
|  |_)  |  /  _____  \  |  |\   |  /  _____  \ |  |__| | |  ` + "`" + `--'  | |  |____
|______/  /__/     \__\ |__| \__| /__/     \__\ \______|  \______/  |_______|
`
	fmt.Println(splashScreen)
}
