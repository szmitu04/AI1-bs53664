<?php

/** @var \App\Model\Koncert $koncert */
/** @var \App\Service\Router $router */

$title = "Edit Koncert {$koncert->getKoncertName()} ({$koncert->getKoncertId()})";
$bodyClass = "edit";

ob_start();
?>
    <h1><?= $title ?></h1>
    <form action="<?= $router->generatePath('koncert-edit') ?>" method="post" class="edit-form">
        <?php require __DIR__ . DIRECTORY_SEPARATOR . '_form.html.php'; ?>
        <input type="hidden" name="action" value="koncert-edit">
        <input type="hidden" name="koncertId" value="<?= $koncert->getKoncertId() ?>">
    </form>

    <ul class="action-list">
        <li><a href="<?= $router->generatePath('koncert-index') ?>">Back to list</a></li>
        <li>
            <form action="<?= $router->generatePath('koncert-delete') ?>" method="post">
                <input type="submit" value="Delete" onclick="return confirm('Are you sure?')">
                <input type="hidden" name="action" value="koncert-delete">
                <input type="hidden" name="koncertId" value="<?= $koncert->getKoncertId() ?>">
            </form>
        </li>
    </ul>

<?php $main = ob_get_clean();

include __DIR__.DIRECTORY_SEPARATOR.'..'.DIRECTORY_SEPARATOR.'base.html.php';