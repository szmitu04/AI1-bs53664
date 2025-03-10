<?php
require_once __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'autoload.php';

$config = new \App\Service\Config();

$templating = new \App\Service\Templating();
$router = new \App\Service\Router();

$action = $_REQUEST['action'] ?? null;
switch ($action) {
    case 'post-index':
    case null:
        $controller = new \App\Controller\PostController();
        $view = $controller->indexAction($templating, $router);
        break;
    case 'post-create':
        $controller = new \App\Controller\PostController();
        $view = $controller->createAction($_REQUEST['post'] ?? null, $templating, $router);
        break;
    case 'post-edit':
        if (! $_REQUEST['id']) {
            break;
        }
        $controller = new \App\Controller\PostController();
        $view = $controller->editAction($_REQUEST['id'], $_REQUEST['post'] ?? null, $templating, $router);
        break;
    case 'post-show':
        if (! $_REQUEST['id']) {
            break;
        }
        $controller = new \App\Controller\PostController();
        $view = $controller->showAction($_REQUEST['id'], $templating, $router);
        break;
    case 'post-delete':
        if (! $_REQUEST['id']) {
            break;
        }
        $controller = new \App\Controller\PostController();
        $view = $controller->deleteAction($_REQUEST['id'], $router);
        break;
    case 'info':
        $controller = new \App\Controller\InfoController();
        $view = $controller->infoAction();
        break;


    case 'koncert-index':
        $controller = new \App\Controller\KoncertController();
        $view = $controller->indexAction($templating, $router);
        break;
    case 'koncert-create':
        $controller = new \App\Controller\KoncertController();
        $view = $controller->createAction($_REQUEST['koncert'] ?? null, $templating, $router);
        break;
    case 'koncert-edit':
        if (! $_REQUEST['koncertId']) {
            break;
        }
        $controller = new \App\Controller\KoncertController();
        $view = $controller->editAction($_REQUEST['koncertId'], $_REQUEST['koncert'] ?? null, $templating, $router);
        break;
    case 'koncert-show':
        if (! $_REQUEST['koncertId']) {
            break;
        }
        $controller = new \App\Controller\KoncertController();
        $view = $controller->showAction($_REQUEST['koncertId'], $templating, $router);
        break;
    case 'koncert-delete':
        if (! $_REQUEST['koncertId']) {
            break;
        }
        $controller = new \App\Controller\KoncertController();
        $view = $controller->deleteAction($_REQUEST['koncertId'], $router);
        break;
    default:
        $view = 'Not found';
        break;
}

if ($view) {
    echo $view;
}
