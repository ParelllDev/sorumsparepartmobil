// Package db membuka koneksi ke PostgreSQL yang sama dengan yang dikelola Prisma.
package db

import (
	"context"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"

	"sorumsparepartmobil/database/config"
)

// Connect membuat pool koneksi dan memastikan database bisa dihubungi.
func Connect(ctx context.Context, cfg *config.Config) (*pgxpool.Pool, error) {
	pc, err := pgxpool.ParseConfig(cfg.DatabaseURL)
	if err != nil {
		return nil, fmt.Errorf("DATABASE_URL tidak valid: %w", err)
	}

	// Ganti ?schema=... milik Prisma dengan search_path milik PostgreSQL.
	pc.ConnConfig.RuntimeParams["search_path"] = cfg.Schema
	pc.MaxConnLifetime = time.Hour
	pc.MaxConnIdleTime = 15 * time.Minute

	ctx, cancel := context.WithTimeout(ctx, 10*time.Second)
	defer cancel()

	pool, err := pgxpool.NewWithConfig(ctx, pc)
	if err != nil {
		return nil, fmt.Errorf("gagal membuat pool koneksi: %w", err)
	}
	if err := pool.Ping(ctx); err != nil {
		pool.Close()
		return nil, fmt.Errorf("gagal terhubung ke database: %w", err)
	}
	return pool, nil
}

// Info mengembalikan nama database dan versi server PostgreSQL.
func Info(ctx context.Context, pool *pgxpool.Pool) (database, version string, err error) {
	err = pool.QueryRow(ctx, `SELECT current_database(), version()`).Scan(&database, &version)
	return database, version, err
}

// Tables mengembalikan daftar tabel di schema tertentu, termasuk
// _prisma_migrations jika migrasi Prisma sudah pernah dijalankan.
func Tables(ctx context.Context, pool *pgxpool.Pool, schema string) ([]string, error) {
	rows, err := pool.Query(ctx, `
		SELECT table_name
		FROM information_schema.tables
		WHERE table_schema = $1 AND table_type = 'BASE TABLE'
		ORDER BY table_name`, schema)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var tables []string
	for rows.Next() {
		var name string
		if err := rows.Scan(&name); err != nil {
			return nil, err
		}
		tables = append(tables, name)
	}
	return tables, rows.Err()
}