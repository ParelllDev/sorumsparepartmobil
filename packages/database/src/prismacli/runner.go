// Package prismacli menjalankan Prisma CLI (yang terpasang lewat pnpm di
// packages/database) dari program Go.
package prismacli

import (
	"context"
	"errors"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"sort"
	"strings"
)

// commands adalah daftar perintah yang diizinkan. Argumen tambahan dari
// pengguna (misalnya --name init) ditambahkan setelahnya.
var commands = map[string][]string{
	"generate":       {"prisma", "generate"},
	"migrate-dev":    {"prisma", "migrate", "dev"},
	"migrate-deploy": {"prisma", "migrate", "deploy"},
	"migrate-status": {"prisma", "migrate", "status"},
	"migrate-reset":  {"prisma", "migrate", "reset"},
	"db-push":        {"prisma", "db", "push"},
	"db-pull":        {"prisma", "db", "pull"},
	"format":         {"prisma", "format"},
	"validate":       {"prisma", "validate"},
	"studio":         {"prisma", "studio"},
}

// Names mengembalikan nama perintah yang tersedia, terurut.
func Names() []string {
	names := make([]string, 0, len(commands))
	for name := range commands {
		names = append(names, name)
	}
	sort.Strings(names)
	return names
}

// Run menjalankan `pnpm prisma ...` di folder packages/database.
func Run(ctx context.Context, name string, extra []string) error {
	base, ok := commands[name]
	if !ok {
		return fmt.Errorf("perintah prisma %q tidak dikenal (pilihan: %s)",
			name, strings.Join(Names(), ", "))
	}

	dir, err := packageDir()
	if err != nil {
		return err
	}

	args := append(append([]string{}, base...), extra...)
	fmt.Printf("> pnpm %s\n", strings.Join(args, " "))

	cmd := exec.CommandContext(ctx, "pnpm", args...)
	cmd.Dir = dir
	cmd.Stdin = os.Stdin
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	if err := cmd.Run(); err != nil {
		var notFound *exec.Error
		if errors.As(err, &notFound) {
			return errors.New("pnpm tidak ditemukan di PATH")
		}
		return fmt.Errorf("prisma gagal: %w", err)
	}
	return nil
}


func packageDir() (string, error) {
	for _, dir := range []string{".", ".."} {
		schema := filepath.Join(dir, "prisma", "schema.prisma")
		if _, err := os.Stat(schema); err == nil {
			return filepath.Abs(dir)
		}
	}
	return "", errors.New("prisma/schema.prisma tidak ditemukan; jalankan dari packages/database atau packages/database/src")
}