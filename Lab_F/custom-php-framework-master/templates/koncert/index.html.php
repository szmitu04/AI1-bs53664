<?php

/** @var \App\Model\Koncert[] $koncerts */
/** @var \App\Service\Router $router */

$title = 'Koncert List';
$bodyClass = 'index';

ob_start();
?>
    <h1>Koncerts List</h1>

    <a href="<?= $router->generatePath('koncert-create') ?>">Add new</a>

    <ul class="index-list">
        <?php foreach ($koncerts as $koncert): ?>
            <li><h3><?= $koncert->getKoncertName() ?></h3>
                <ul class="action-list">
                    <li><a href="<?= $router->generatePath('koncert-show', ['koncertId' => $koncert->getKoncertId()]) ?>">Details</a></li>
                    <li><a href="<?= $router->generatePath('koncert-edit', ['koncertId' => $koncert->getKoncertId()]) ?>">Edit</a></li>
                </ul>
            </li>
        <?php endforeach; ?>
    </ul>

<?php $main = ob_get_clean();

include __DIR__.DIRECTORY_SEPARATOR.'..'.DIRECTORY_SEPARATOR.'base.html.php';