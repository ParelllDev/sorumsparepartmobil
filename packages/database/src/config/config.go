// Package config membaca .env milik packages/database dan menyiapkan
// DATABASE_URL yang sama dengan yang dipakai Prisma.
package config

import (
	"errors"
	"fmt"
	"net/url"
	"os"
	"path/filepath"
	"regexp"

	"github.com/joho/godotenv"
)

// Config berisi pengaturan koneksi database.
type Config struct {
	// DatabaseURL sudah dibersihkan dari parameter khusus Prisma sehingga
	// aman dipakai pgx.
	DatabaseURL string
	// Schema adalah schema PostgreSQL yang dipakai (default "public").
	Schema string
}

var schemaName = regexp.MustCompile(`^[A-Za-z_][A-Za-z0-9_]*$`)

// Parameter yang hanya dikenal Prisma. pgx akan menolaknya sebagai
// "unrecognized configuration parameter", jadi harus dibuang.
var prismaOnlyParams = []string{
	"schema",
	"connection_limit",
	"pool_timeout",
	"pgbouncer",
	"socket_timeout",
	"statement_cache_size",
}

// Load membaca .env (dari folder kerja atau satu tingkat di atasnya) lalu
// membentuk Config dari DATABASE_URL. Variabel yang sudah ada di environment
// tidak ditimpa oleh isi .env.
func Load() (*Config, error) {
	for _, p := range []string{".env", filepath.Join("..", ".env")} {
		if _, err := os.Stat(p); err == nil {
			if err := godotenv.Load(p); err != nil {
				return nil, fmt.Errorf("gagal membaca %s: %w", p, err)
			}
			break
		}
	}

	raw := os.Getenv("DATABASE_URL")
	if raw == "" {
		return nil, errors.New("DATABASE_URL belum diisi (cek file .env di packages/database)")
	}
	return Parse(raw)
}

// Parse mengubah URL gaya Prisma menjadi Config untuk pgx.
//
// Contoh: postgresql://user:pass@localhost:5432/db?schema=public
func Parse(raw string) (*Config, error) {
	u, err := url.Parse(raw)
	if err != nil {
		return nil, fmt.Errorf("DATABASE_URL tidak valid: %w", err)
	}
	if u.Scheme != "postgresql" && u.Scheme != "postgres" {
		return nil, fmt.Errorf("DATABASE_URL harus diawali postgresql://, bukan %q", u.Scheme)
	}

	// u.Query() membuang pasangan yang rusak tanpa memberi tahu, jadi pakai
	// ParseQuery agar kesalahan di DATABASE_URL terlihat.
	q, err := url.ParseQuery(u.RawQuery)
	if err != nil {
		return nil, fmt.Errorf("parameter di DATABASE_URL tidak valid: %w", err)
	}

	schema := q.Get("schema")
	if schema == "" {
		schema = "public"
	}
	if !schemaName.MatchString(schema) {
		return nil, fmt.Errorf("nama schema %q tidak valid", schema)
	}

	// connection_limit milik Prisma setara dengan pool_max_conns milik pgxpool.
	if limit := q.Get("connection_limit"); limit != "" && q.Get("pool_max_conns") == "" {
		q.Set("pool_max_conns", limit)
	}
	for _, key := range prismaOnlyParams {
		q.Del(key)
	}
	u.RawQuery = q.Encode()

	return &Config{DatabaseURL: u.String(), Schema: schema}, nil
}