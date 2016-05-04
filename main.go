package main

import (
	"bytes"
	"database/sql"
	"encoding/json"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	_ "github.com/mattn/go-sqlite3"
	"gopkg.in/gorp.v1"
)

type Work struct {
	ID   int32
	User string
	Name string
	Time time.Time
}

var dbmap *(gorp.DbMap)

func main() {
	db, err := sql.Open("sqlite3", "./work.db")
	checkErr(err)
	dbmap = &gorp.DbMap{Db: db, Dialect: gorp.SqliteDialect{}}
	t := dbmap.AddTableWithName(Work{}, "work").SetKeys(true, "ID")
	t.ColMap("ID").Rename("id")
	t.ColMap("Name").Rename("name")
	t.ColMap("User").Rename("user")
	t.ColMap("Time").Rename("time")
	err = dbmap.CreateTablesIfNotExists()
	checkErr(err)

	router := gin.Default()

	router.GET("/start", start)
	router.GET("/status", status)

	router.StaticFile("./top.html", "./index.html")
	router.StaticFile("./bundle.js", "./bundle.js")
	router.StaticFile("./bundle.js.map", "./bundle.js.map")

	port := os.Getenv("PORT")
	if len(port) == 0 {
		port = "8080"
	}
	router.Run(":" + port)
}

func start(c *gin.Context) {
	user := c.Query("user")
	if user == "" {
		user = "Anonymous user"
	}
	work := c.Query("work")
	if work == "" {
		c.String(http.StatusOK, "Hello %s, what do you want to start?", user)
	} else {
		c.String(http.StatusOK, "Hello %s, you started %s", user, work)
		tx, _ := dbmap.Begin()
		tx.Insert(&Work{0, user, work, time.Now()})
		tx.Commit()
	}
}

func status(c *gin.Context) {
	user := c.Query("user")
	if user == "" {
		user = "Anonymous user"
	}
	list, err := dbmap.Select(Work{}, "select * from work where user = ?", user)
	checkErr(err)

	casted := make([]Work, len(list))
	for i, item := range list {
		casted[i] = *item.(*Work)
	}
	jsonBytes, err := json.Marshal(casted)
	checkErr(err)

	out := new(bytes.Buffer)
	json.Indent(out, jsonBytes, "", "    ")
	c.String(http.StatusOK, "%s", out.String())
}

func checkErr(err error) {
	if err != nil {
		panic(err.Error())
	}
}
