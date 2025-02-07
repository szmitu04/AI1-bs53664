<?php

/** @var \App\Model\Koncert $koncert */
/** @var \App\Service\Router $router */

$title = 'Add Koncert';
$bodyClass = "edit";

ob_start();
?>
    <h1>Add Koncert</h1>
    <form action="<?= $router->generatePath('koncert-create') ?>" method="post" class="edit-form">
        <?php require __DIR__.DIRECTORY_SEPARATOR.'_form.html.php'; ?>
        <input type="hidden" name="action" value="koncert-create">
    </form>

    <a href="<?= $router->generatePath('koncert-index') ?>">Back to list</a>
<?php $main = ob_get_clean();

include __DIR__.DIRECTORY_SEPARATOR.'..'.DIRECTORY_SEPARATOR.'base.html.php';