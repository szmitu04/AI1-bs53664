<?php

namespace App\Model;

use App\Service\Config;

class Koncert
{
    private ?int $koncertId = null;
    private ?string $koncertName = null;
    private ?string $koncertDate = null;
    private ?string $koncertBand = null;

    public function getKoncertId(): ?int
    {
        return $this->koncertId;
    }

    public function setKoncertId(?int $koncertId): Koncert
    {
        $this->koncertId = $koncertId;

        return $this;
    }

    public function getKoncertName(): ?string
    {
        return $this->koncertName;
    }

    public function setKoncertName(?string $koncertName): Koncert
    {
        $this->koncertName = $koncertName;

        return $this;
    }

    public function getKoncertDate(): ?string
    {
        return $this->koncertDate;
    }

    public function setKoncertDate(?string $koncertDate): Koncert
    {
        $this->koncertDate = $koncertDate;

        return $this;
    }

    public function getKoncertBand(): ?string
    {
        return $this->koncertBand;
    }

    public function setKoncertBand(?string $koncertBand): Koncert
    {
        $this->koncertBand = $koncertBand;

        return $this;
    }

    public static function fromArray(array $array): Koncert
    {
        $koncert = new self();
        $koncert->fill($array);

        return $koncert;
    }

    public function fill(array $array): Koncert
    {
        if (isset($array['koncertId']) && ! $this->getKoncertId()) {
            $this->setKoncertId($array['koncertId']);
        }
        if (isset($array['koncertName'])) {
            $this->setKoncertName($array['koncertName']);
        }
        if (isset($array['koncertDate'])) {
            $this->setKoncertDate($array['koncertDate']);
        }
        if (isset($array['koncertBand'])) {
            $this->setKoncertBand($array['koncertBand']);
        }

        return $this;
    }

    public static function findAll(): array
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = "SELECT * FROM koncert";
        $statement = $pdo->prepare($sql);
        $statement->execute();

        $koncerts = [];
        $koncertsArray = $statement->fetchAll(\PDO::FETCH_ASSOC);
        foreach ($koncertsArray as $koncert) {
            $koncerts[] = self::fromArray($koncert);
        }

        return $koncerts;
    }

    public static function find($id): ?Koncert
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = "SELECT * FROM koncert WHERE koncertId = :koncertId";
        $statement = $pdo->prepare($sql);
        $statement->execute(['koncertId' => $id]);

        $koncertArray = $statement->fetchAll(\PDO::FETCH_ASSOC);
        if (! $koncertArray) {
            return null;
        }
        $koncert = Koncert::fromArray($koncertArray);

        return $koncert;
    }

    public function save(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        if (! $this->getKoncertId()) {
            $sql = "INSERT INTO koncert (koncertName, koncertDate, koncertBand) VALUES (:koncertName, :koncertDate, :koncertBand)";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                'koncertName' => $this->getKoncertName(),
                'koncertDate' => $this->getKoncertDate(),
                'koncertBand' => $this->getKoncertBand()
            ]);

            $this->setKoncertId($pdo->lastInsertId()) ;
        } else {
            $sql = "UPDATE koncert SET koncertName = :koncertName, koncertDate = :koncertDate, koncertBand = :koncertBand WHERE koncertId = :koncertId";

            $statement = $pdo->prepare($sql);
            $statement->execute([
                'koncertName' => $this->getKoncertName(),
                'koncertDate' => $this->getKoncertDate(),
                'koncertBand' => $this->getKoncertBand(),
                'koncertId' => $this->getKoncertId()
            ]);
        }
    }

    public function delete(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = "DELETE FROM koncert WHERE koncertId = :koncertId";
        $statement = $pdo->prepare($sql);
        $statement->execute([
            'koncertId' => $this->getKoncertId()
        ]);

        $this->setKoncertId(null);
        $this->setKoncertName(null);
        $this->setKoncertDate(null);
        $this->setKoncertBand(null);
    }
}