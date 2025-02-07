<?php

namespace App\Controller;

use App\Exception\NotFoundException;
use App\Model\Koncert;
use App\Service\Router;
use App\Service\Templating;

class KoncertController
{
    public function indexAction(Templating $templating, Router $router): ?string
    {
        $koncerts = Koncert::findAll();
        $html = $templating->render('koncert/index.html.php', [
            'koncerts' => $koncerts,
            'router' => $router
        ]);
        return $html;
    }

    public function createAction(?array $requestKoncert, Templating $templating, Router $router): ?string
    {
        if ($requestKoncert) {
            $koncert = Koncert::fromArray($requestKoncert);

            $koncert->save();

            $path = $router->generatePath('koncert-index');
            $router->redirect($path);
            return null;
        } else {
            $koncert = new Koncert();
        }

        $html = $templating->render('koncert/create.html.php', [
            'koncert' => $koncert,
            'router' => $router
        ]);
        return $html;
    }

    public function editAction(int $koncertId, ?array $requestKoncert, Templating $templating, Router $router): ?string
    {
        $koncert = Koncert::find($koncertId);
        if (! $koncert) {
            throw new NotFoundException("Missing koncert with id $koncertId");
        }

        if ($requestKoncert) {
            $koncert->fill($requestKoncert);

            $koncert->save();

            $path = $router->generatePath('koncert-index');
            $router->redirect($path);
            return null;
        }

        $html = $templating->render('koncert/edit.html.php', [
            'koncert' => $koncert,
            'router' => $router
        ]);
        return $html;
    }

    public function showAction(int $koncertId, Templating $templating, Router $router): ?string
    {
        $koncert = Koncert::find($koncertId);
        if (! $koncert) {
            throw new NotFoundException("Missing koncert with id $koncertId");
        }

        $html = $templating->render('koncert/show.html.php', [
            'koncert' => $koncert,
            'router' => $router
        ]);
        return $html;
    }

    public function deleteAction(int $koncertId, Router $router): ?string
    {
        $koncert = Koncert::find($koncertId);
        if (! $koncert) {
            throw new NotFoundException("Missing koncert with id $koncertId");
        }

        $koncert->delete();
        $path = $router->generatePath('koncert-index');
        $router->redirect($path);
        return null;
    }
}