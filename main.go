package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"

	"github.com/go-sql-driver/mysql"
	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

type Post struct {
	ID    string `json:"id"`
	Title string `json:"title"`
}

type Trainer struct {
	Trainer string `json:"trainer"`
}

type Exercise struct {
	ID            int     `json:"id"`
	Name          string  `json:"name"`
	CorrectData   string  `json:"correctdata"`
	Trainer       string  `json:"trainer"`
	PhoneLocation string  `json:"phonelocation"`
	Time          float32 `json:"time"`
}

type UserExercise struct {
	ID        int    `json:"id"`
	Username  string `json:"name"`
	Exercises string `json:"exercises"`
	Trainers  string `json:"trainers"`
}

type Execution struct {
	ID                int            `json:"id"`
	Username          string         `json:"name"`
	Name              string         `json:"name"`
	ExecutionData     string         `json:"executiondata"`
	Comment           string         `json:"comment"`
	ExecutionAccuracy int            `json:"executionaccuracy"`
	Date              mysql.NullTime `json:"date"`
}

type User struct {
	Role string `json:"role"`
}

var db *sql.DB
var err error

func main() {
	db, err = sql.Open("mysql", "root:root@tcp(localhost)/helper")
	if err != nil {
		panic(err.Error())
	}
	defer db.Close()

	c := cors.New(cors.Options{
		AllowedOrigins: []string{"*"},
		AllowedMethods: []string{"GET", "POST", "DELETE", "PUT"},
	})

	router := mux.NewRouter()

	router.HandleFunc("/exercises", getExercises).Methods("GET")
	router.HandleFunc("/exercise/{name}", getExercise).Methods("GET")
	router.HandleFunc("/exercises/{id}", getExercisesByTrainer).Methods("GET")
	router.HandleFunc("/alltrainers", getTrainers).Methods("GET")
	router.HandleFunc("/userexercises/{username}", getUserExercises).Methods("GET")
	router.HandleFunc("/exercise", createTrainerExercise).Methods("POST")
	router.HandleFunc("/userexercises", createUserExercises).Methods("POST")
	router.HandleFunc("/execution", createExecution).Methods("POST")
	router.HandleFunc("/executions/{exercise}/{userEmail}", getExecutions).Methods("GET")
	router.HandleFunc("/exercise/{id}", updateExercise).Methods("PUT")
	router.HandleFunc("/userrole/{email}", getUserRole).Methods("GET")
	router.HandleFunc("/userrole", createUserRole).Methods("POST")
	router.HandleFunc("/execution/{id}", deleteExecution).Methods("DELETE")
	router.HandleFunc("/comment/{id}", updateComment).Methods("PUT")
	router.HandleFunc("/trainerusers/{trainer}", getTrainerUsers).Methods("GET")

	http.ListenAndServe(":8000", c.Handler(router))
}

func getUserRole(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	params := mux.Vars(r)
	result, err := db.Query("SELECT role from users WHERE email = ?", params["email"])
	if err != nil {
		panic(err.Error())
	}
	defer result.Close()
	var user User
	for result.Next() {
		err := result.Scan(&user.Role)
		if err != nil {
			panic(err.Error())
		}
	}
	if user.Role == "" {
		user.Role = "Vartotojas"
	}
	json.NewEncoder(w).Encode(user)
}

func getTrainerUsers(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	var users []UserExercise
	params := mux.Vars(r)
	result, err := db.Query("SELECT id, userName from usersexercises WHERE trainers like ?", "%"+params["trainer"]+"%")
	if err != nil {
		panic(err.Error())
	}
	defer result.Close()
	for result.Next() {
		var user UserExercise
		err := result.Scan(&user.ID, &user.Username)
		if err != nil {
			panic(err.Error())
		}
		users = append(users, user)
	}
	json.NewEncoder(w).Encode(users)
}

func getExecutions(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	var executions []Execution
	params := mux.Vars(r)
	result, err := db.Query("SELECT id, userName, name, executionData, comment, executionAccuracy, date from executions WHERE name = ? AND username = ?", params["exercise"], params["userEmail"])
	if err != nil {
		panic(err.Error())
	}
	defer result.Close()
	for result.Next() {
		var execution Execution
		err := result.Scan(&execution.ID, &execution.Username, &execution.Name, &execution.ExecutionData, &execution.Comment, &execution.ExecutionAccuracy, &execution.Date)
		if err != nil {
			panic(err.Error())
		}
		executions = append(executions, execution)
	}
	json.NewEncoder(w).Encode(executions)
}

func getExercises(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	var exercises []Exercise
	result, err := db.Query("SELECT id, name, correctData, trainer, phoneLocation, time from exercises")
	if err != nil {
		panic(err.Error())
	}
	defer result.Close()
	for result.Next() {
		var exercise Exercise
		err := result.Scan(&exercise.ID, &exercise.Name, &exercise.CorrectData, &exercise.Trainer, &exercise.PhoneLocation, &exercise.Time)
		if err != nil {
			panic(err.Error())
		}
		exercises = append(exercises, exercise)
	}
	json.NewEncoder(w).Encode(exercises)
}

//gets exercise information when exercise is supplied
func getExercise(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	params := mux.Vars(r)
	result, err := db.Query("SELECT id, name, correctData, trainer, phoneLocation, time from exercises WHERE name = ?", params["name"])
	if err != nil {
		panic(err.Error())
	}
	defer result.Close()
	var exercise Exercise
	for result.Next() {
		err := result.Scan(&exercise.ID, &exercise.Name, &exercise.CorrectData, &exercise.Trainer, &exercise.PhoneLocation, &exercise.Time)
		if err != nil {
			panic(err.Error())
		}
	}
	json.NewEncoder(w).Encode(exercise)
}

func createUserRole(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	params := mux.Vars(r)
	stmt, err := db.Prepare("INSERT INTO users (id, email, role) VALUES (DEFAULT, ?, ?)")
	if err != nil {
		panic(err.Error())
	}
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		panic(err.Error())
	}
	keyVal := make(map[string]string)
	json.Unmarshal(body, &keyVal)
	email := keyVal["email"]
	role := keyVal["role"]
	_, err = stmt.Exec(email, role)
	if err != nil {
		panic(err.Error())
	}
	fmt.Fprintf(w, "User role with ID = %s was created", params["id"])
}

func getTrainers(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	var trainers []Trainer
	result, err := db.Query("SELECT DISTINCT trainer FROM exercises WHERE trainer NOT LIKE 'No'")
	if err != nil {
		panic(err.Error())
	}
	defer result.Close()
	for result.Next() {
		var trainer Trainer
		err := result.Scan(&trainer.Trainer)
		if err != nil {
			panic(err.Error())
		}
		trainers = append(trainers, trainer)
	}
	json.NewEncoder(w).Encode(trainers)
}

func getUserExercises(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	params := mux.Vars(r)
	result, err := db.Query("SELECT id, exercises, trainers from usersexercises WHERE username = ?", params["username"])
	if err != nil {
		panic(err.Error())
	}
	defer result.Close()
	var userExercises UserExercise
	for result.Next() {
		err := result.Scan(&userExercises.ID, &userExercises.Exercises, &userExercises.Trainers)
		if err != nil {
			panic(err.Error())
		}
	}
	json.NewEncoder(w).Encode(userExercises)
}

func getExercisesByTrainer(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	var exercises []Exercise
	params := mux.Vars(r)
	result, err := db.Query("SELECT id, name, correctData, trainer, phoneLocation, time from exercises WHERE trainer = ?", params["id"])
	if err != nil {
		panic(err.Error())
	}
	defer result.Close()
	for result.Next() {
		var exercise Exercise
		err := result.Scan(&exercise.ID, &exercise.Name, &exercise.CorrectData, &exercise.Trainer, &exercise.PhoneLocation, &exercise.Time)
		if err != nil {
			panic(err.Error())
		}
		exercises = append(exercises, exercise)

	}
	json.NewEncoder(w).Encode(exercises)
}

func createTrainerExercise(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	params := mux.Vars(r)
	stmt, err := db.Prepare("INSERT INTO exercises (id, name, correctData, trainer, phoneLocation, time) VALUES (DEFAULT, ?, ?, ?, ?, ?)")
	if err != nil {
		panic(err.Error())
	}
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		panic(err.Error())
	}
	keyVal := make(map[string]string)
	json.Unmarshal(body, &keyVal)
	name := keyVal["name"]
	correctData := keyVal["correctData"]
	trainer := keyVal["trainer"]
	phoneLocation := keyVal["phoneLocation"]
	time := keyVal["time"]
	_, err = stmt.Exec(name, correctData, trainer, phoneLocation, time)
	if err != nil {
		panic(err.Error())
	}
	fmt.Fprintf(w, "Exercise with ID = %s was created", params["id"])
}

func createUserExercises(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	params := mux.Vars(r)
	stmt, err := db.Prepare("INSERT INTO usersexercises (id, userName, exercises, trainers) VALUES (DEFAULT,?, ?, ?)\n  ON DUPLICATE KEY UPDATE exercises=VALUES(exercises), trainers=VALUES(trainers)")
	if err != nil {
		panic(err.Error())
	}
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		panic(err.Error())
	}
	keyVal := make(map[string]string)
	json.Unmarshal(body, &keyVal)
	userName := keyVal["username"]
	newExercises := keyVal["exercises"]
	newTrainers := keyVal["trainers"]
	_, err = stmt.Exec(userName, newExercises, newTrainers)
	if err != nil {
		panic(err.Error())
	}
	fmt.Fprintf(w, "User choises with ID = %s was updated", params["id"])
}

func createExecution(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	params := mux.Vars(r)
	stmt, err := db.Prepare("INSERT INTO executions (id, userName, name, executionData, executionAccuracy, date) VALUES (DEFAULT, ?, ?, ?, ?, ?)")
	if err != nil {
		panic(err.Error())
	}
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		panic(err.Error())
	}
	keyVal := make(map[string]string)
	json.Unmarshal(body, &keyVal)
	userName := keyVal["username"]
	name := keyVal["name"]
	executionData := keyVal["executionData"]
	executionAccuracy := keyVal["executionAccuracy"]
	date := keyVal["date"]
	_, err = stmt.Exec(userName, name, executionData, executionAccuracy, date)
	if err != nil {
		panic(err.Error())
	}
	fmt.Fprintf(w, "Execution with ID = %s was created", params["id"])
}

func updateExercise(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	params := mux.Vars(r)
	stmt, err := db.Prepare("UPDATE exercises SET name=?, correctData=?, phoneLocation=?, time=? WHERE id = ?")
	if err != nil {
		panic(err.Error())
	}
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		panic(err.Error())
	}
	keyVal := make(map[string]string)
	json.Unmarshal(body, &keyVal)
	name := keyVal["name"]
	correctData := keyVal["correctData"]
	phoneLocation := keyVal["phoneLocation"]
	time := keyVal["time"]
	_, err = stmt.Exec(name, correctData, phoneLocation, time, params["id"])
	if err != nil {
		panic(err.Error())
	}
	fmt.Fprintf(w, "Exercise with ID = %s was updated", params["id"])
}

func updateComment(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	params := mux.Vars(r)
	stmt, err := db.Prepare("UPDATE executions SET comment=? WHERE id = ?")
	if err != nil {
		panic(err.Error())
	}
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		panic(err.Error())
	}
	keyVal := make(map[string]string)
	json.Unmarshal(body, &keyVal)
	comment := keyVal["comment"]
	_, err = stmt.Exec(comment, params["id"])
	if err != nil {
		panic(err.Error())
	}
	fmt.Fprintf(w, "Comment for Exercise ID = %s was updated", params["id"])
}

func deleteExecution(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	params := mux.Vars(r)
	stmt, err := db.Prepare("DELETE FROM executions WHERE id = ?")
	if err != nil {
		panic(err.Error())
	}
	_, err = stmt.Exec(params["id"])
	if err != nil {
		panic(err.Error())
	}
	fmt.Fprintf(w, "Execution with ID = %s was deleted", params["id"])
}
