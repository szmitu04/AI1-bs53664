<?php
namespace App\Model;

use PDO;
use App\Service\Config;

class Comment
{
    private PDO $pdo;

    public function __construct()
    {
        $this->pdo = new PDO(Config::get('dsn'));
    }

    public function getAllByPostId($postId): array
    {
        $stmt = $this->pdo->prepare("SELECT * FROM koncert WHERE post_id = ?");
        $stmt->execute([$postId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Pobiera post na podstawie ID
     *
     * @param int $id
     * @return array|false Zwraca tablicę z danymi posta lub `false`, jeśli nie znaleziono
     */
    public function get($id)
    {
        $query = "SELECT * FROM post WHERE id = :id";
        $statement = $this->db->prepare($query);
        $statement->bindParam(':id', $id, PDO::PARAM_INT);
        $statement->execute();

        return $statement->fetch(PDO::FETCH_ASSOC);
    }

    public function create($postId, $content): void
    {
        $stmt = $this->pdo->prepare("INSERT INTO koncert (post_id, content) VALUES (?, ?)");
        $stmt->execute([$postId, $content]);
    }

    public function delete($id): void
    {
        $stmt = $this->pdo->prepare("DELETE FROM koncert WHERE id = ?");
        $stmt->execute([$id]);
    }
}
