<?php

/** @var \App\Model\Koncert $koncert */
/** @var \App\Service\Router $router */

$title = "{$koncert->getKoncertName()} ({$koncert->getKoncertId()})";
$bodyClass = 'show';

ob_start();
?>
    <h1><?= $koncert->getKoncertName(); ?></h1>
    <article>
        <p>Date: <b><?= $koncert->getKoncertDate() ?></b></p>
        <p>Band: <b><?= $koncert->getKoncertBand() ?></b></p>
    </article>

    <ul class="action-list">
        <li><a href="<?= $router->generatePath('koncert-index') ?>">Back to list</a></li>
        <li><a href="<?= $router->generatePath('koncert-edit', ['koncertId' => $koncert->getKoncertId()]) ?>">Edit</a></li>
    </ul>
<?php $main = ob_get_clean();

include __DIR__.DIRECTORY_SEPARATOR.'..'.DIRECTORY_SEPARATOR.'base.html.php';