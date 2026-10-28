package main

import (
	"context"
	"errors"
	"fmt"
	"os"
	"os/signal"
	"strings"

	"sorumsparepartmobil/database/config"
	"sorumsparepartmobil/database/db"
	"sorumsparepartmobil/database/prismacli"
)

func usage() string {
	return fmt.Sprintf(`Database tool (Go) untuk sorumsparepartmobil

Pemakaian:
  go run . <perintah>

Perintah:
  ping                      cek koneksi ke database
  tables                    tampilkan tabel di schema aktif
  prisma <perintah> [args]  jalankan Prisma CLI

Perintah prisma:
  %s

Contoh:
  go run . ping
  go run . prisma migrate-dev --name init
  go run . prisma migrate-deploy
`, strings.Join(prismacli.Names(), ", "))
}

func main() {
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt)
	defer stop()

	if err := run(ctx, os.Args[1:]); err != nil {
		fmt.Fprintln(os.Stderr, "Error:", err)
		os.Exit(1)
	}
}

func run(ctx context.Context, args []string) error {
	if len(args) == 0 {
		fmt.Print(usage())
		return nil
	}

	switch args[0] {
	case "ping":
		return cmdPing(ctx)
	case "tables":
		return cmdTables(ctx)
	case "prisma":
		if len(args) < 2 {
			return errors.New("sebutkan perintah prisma, contoh: prisma migrate-deploy")
		}
		return prismacli.Run(ctx, args[1], args[2:])
	case "help", "-h", "--help":
		fmt.Print(usage())
		return nil
	default:
		fmt.Fprint(os.Stderr, usage())
		return fmt.Errorf("perintah %q tidak dikenal", args[0])
	}
}

func cmdPing(ctx context.Context) error {
	cfg, err := config.Load()
	if err != nil {
		return err
	}
	pool, err := db.Connect(ctx, cfg)
	if err != nil {
		return err
	}
	defer pool.Close()

	name, version, err := db.Info(ctx, pool)
	if err != nil {
		return err
	}
	fmt.Printf("Terhubung ke database %q (schema %q)\n%s\n", name, cfg.Schema, version)
	return nil
}

func cmdTables(ctx context.Context) error {
	cfg, err := config.Load()
	if err != nil {
		return err
	}
	pool, err := db.Connect(ctx, cfg)
	if err != nil {
		return err
	}
	defer pool.Close()

	tables, err := db.Tables(ctx, pool, cfg.Schema)
	if err != nil {
		return err
	}
	if len(tables) == 0 {
		fmt.Printf("Belum ada tabel di schema %q. Jalankan: go run . prisma migrate-dev --name init\n", cfg.Schema)
		return nil
	}
	for _, t := range tables {
		fmt.Println(t)
	}
	return nil
}