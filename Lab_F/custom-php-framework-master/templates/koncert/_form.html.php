<?php
/** @var $koncert ?\App\Model\Koncert */
?>

<div class="form-group">
    <label for="koncertName">Name</label>
    <input type="text" id="koncertName" name="koncert[koncertName]" value="<?= $koncert ? $koncert->getKoncertName() : '' ?>">
</div>

<div class="form-group">
    <label for="koncertDate">Date</label>
    <input type="date" id="koncertDate" name="koncert[koncertDate]" value="<?= $koncert ? $koncert->getKoncertDate() : '' ?>">
</div>

<div class="form-group">
    <label for="koncertBand">Band</label>
    <input type="text" id="koncertBand" name="koncert[koncertBand]" value="<?= $koncert ? $koncert->getKoncertBand() : '' ?>">
</div>

<div class="form-group">
    <label></label>
    <input type="submit" value="Submit">
</div>