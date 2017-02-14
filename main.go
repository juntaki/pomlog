package main

import (
	"bytes"
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/markbates/goth"
	"github.com/markbates/goth/gothic"
	"github.com/markbates/goth/providers/twitter"
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
	// setup database
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

	// oauth
	goth.UseProviders(
		twitter.NewAuthenticate(os.Getenv("TWITTER_KEY"), os.Getenv("TWITTER_SECRET"), "http://lab.juntaki.com/api/counter?provider=twitter"),
	)

	// routing
	router := gin.Default()
	router.LoadHTMLGlob("./dist/*.html")
	router.GET("/auth", gin.WrapF(gothic.BeginAuthHandler))
	router.GET("/auth/callback", auth)

	authRouter := router.Group("/api")
	authRouter.GET("/start", start)
	authRouter.GET("/status", status)
	authRouter.GET("/counter", counter)

	router.Static("/static", "./dist/")
	router.StaticFile("/", "./dist/index.html")

	port := os.Getenv("PORT")
	if len(port) == 0 {
		port = "8080"
	}
	router.Run(":" + port)
}

func counter(c *gin.Context) {
	c.HTML(http.StatusOK, "counter.html", nil)
}

func auth(c *gin.Context) {
	user, err := gothic.CompleteUserAuth(c.Writer, c.Request)
	if err != nil {
		fmt.Fprintln(c.Writer, err)
		return
	}
	c.Set("cred", user)
}

func start(c *gin.Context) {
	user := c.Query("user")
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
	cred, ex := c.Get("cred")
	if !ex {
		c.Abort()
	}
	user := cred.(goth.User).Name
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
