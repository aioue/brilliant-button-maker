<?php
/*
 * Brilliant Button 80x15 Maker
 *
 * Copyright (C) 2004-2005  Luca Zappa, www.lucazappa.com, luca@lucazappa.com
 *
 *
 * Date        : 2005/09/13 (yyyy/mm/dd)
 * Last update : $Date: 2005-03-31 00:39:46 +0200 (Thu, 31 Mar 2005) $
 * Revision    : $Revision: 261 $
 *
 * License:
 *
 * This program is free software; you can redistribute it and/or modify it under the terms
 * of the GNU General Public License as published by the Free Software Foundation; either
 * version 2 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with this program;
 * if not, write to the Free Software Foundation, Inc., 675 Mass Ave, Cambridge, MA 02139, USA.
 *
 * http://www.opensource.org/licenses/gpl-license.php
 *
 *
 * Example:
 *
 * $button = new BrilliantButton();
 * $button->setOuterBorder($outerBorder);
 * $button->setInnerBorder($innerBorder);
 * $button->setBarPosition($barPosition);
 * $button->setLeftFill($leftFill);
 * $button->setLeftText($leftText);
 * $button->setLeftTextColor($leftTextColor);
 * $button->setLeftTextPosition($leftTextPosition);
 * $button->setRightFill($rightFill);
 * $button->setRightText($rightText);
 * $button->setRightTextColor($rightTextColor);
 * $button->setRightTextPosition($rightTextPosition);
 * $button->setFontName($fontName);
 * $button->setImgLeft($save_img_left);
 * $button->setImgRight($save_img_right);
 *
 * $im_button=$button->createButton();
 *
 */

function ImageColorAllocateHex( $image, $hex ) {
	for( $i=0; $i<3; $i++ ) {
		$temp = substr($hex, 2*$i, 2);
		$rgb[$i] = 16 * hexdec( substr($temp, 0, 1) ) + hexdec(substr($temp, 1, 1));
	}
	$rgb = ImageColorAllocate ( $image, $rgb[0], $rgb[1], $rgb[2] );
	return $rgb;
}


function imageresize($img,$width=0,$height=0,$percent=0) {

	// create an image of the given filetype
	if (strpos(strtolower($img),".jpg") !== false || strpos(strtolower($img),".jpeg") !== false) {
		$image = ImageCreateFromJpeg($img);
	}
	elseif (strpos(strtolower($img),".png") !== false) {
		$image = ImageCreateFromPng($img);
	}
	elseif (strpos(strtolower($img),".gif") !== false) {
		$image = ImageCreateFromGif($img);
	}

	$size = getimagesize ($img);

	// calculate missing values
	if ($width && !$height) {
		$height = ($size[1] / $size[0]) * $width;
	}
	elseif (!$width && $height) {
		$width = ($size[0] / $size[1]) * $height;
	}
	elseif ($percent) {
		$width = $size[0] / 100 * $percent;
		$height = $size[1] / 100 * $percent;
	}
	elseif (!$width && !$height && !$percent) {
		$width = 15; // here you can enter a standard value for actions where no arguments are given
		$height = ($size[1] / $size[0]) * $width;
	}



	$thumb = imagecreatetruecolor ($width, $height);

	if (function_exists("imageCopyResampled")) {
		if (!@ImageCopyResampled($thumb, $image, 0, 0, 0, 0, $width, $height, $size[0], $size[1])) {
			ImageCopyResized($thumb, $image, 0, 0, 0, 0, $width, $height, $size[0], $size[1]);
		}
	}
	else {
		ImageCopyResized($thumb, $image, 0, 0, 0, 0, $width, $height, $size[0], $size[1]);
	}

	// return the image
	return $thumb;
}



class BrilliantButton {
	var $outerBorder="666666";
	var $innerBorder="ffffff";
	var $barPosition=25;
	var $leftFill="ff6600";
	var $leftText="RSS";
	var $leftTextColor="ffffff";
	var $leftTextPosition=5;
	var $rightFill="898E79";
	var $rightText="VALID";
	var $rightTextColor="ffffff";
	var $rightTextPosition=4;
	var $fontName="silkscreen";

	var $imgLeft="";
	var $imgRight="";

	var $font_config = array (
		"silkscreen" => 5,
		"terminal6" => 4,
		"proggyclean" => 2,
		"proggysquare" => 2,
		"courier8" => 0,
		"8x13iso" => 1
	);


	function BrilliantButton() {
	}

	function createButton() {
		// URL to Bill Zeller's script
		$url_button="http://".$_SERVER['HTTP_HOST'].dirname($_SERVER['PHP_SELF'])."/button.php";
		$url_param = 	"?outerBorder=".$this->outerBorder.
						"&innerBorder=".$this->innerBorder.
						"&barPosition=".$this->barPosition.
						"&leftFill=".$this->leftFill.
						"&leftText=".($this->fontName!='silkscreen' ? '' : $this->leftText).
						"&leftTextColor=".$this->leftTextColor.
						"&leftTextPosition=".$this->leftTextPosition.
						"&rightFill=".$this->rightFill.
						"&rightText=".($this->fontName!='silkscreen' ? '' : $this->rightText).
						"&rightTextColor=".$this->rightTextColor.
						"&rightTextPosition=".($this->barPosition+$this->rightTextPosition).
						"&fontName=".$this->fontName;


		$imButton=imageCreateFromPng($url_button.$url_param);

		if (is_file('font/'.$this->fontName.'.gdf')) {
			$font = imageloadfont('font/'.$this->fontName.'.gdf');
			imagestring(
				$imButton,
				$font,
				$this->leftTextPosition,
				$this->font_config[$this->fontName],
				$this->leftText,
				ImageColorAllocateHex($imButton, $this->leftTextColor)
			);
			imagestring(
				$imButton,
				$font,
				$this->barPosition+$this->rightTextPosition,
				$this->font_config[$this->fontName],
				$this->rightText,
				ImageColorAllocateHex($imButton, $this->rightTextColor)
			);
		}

		//left image
		if ( isset($this->imgLeft) && $this->imgLeft!='' ) {
			$im2=imageresize($this->imgLeft,0,11);
			//left
			imageCopyMerge($imButton, $im2, 2, 2, 0, 0, imagesx($im2), imagesy($im2),100);
		}

		//right image
		if ( isset($this->imgRight) && $this->imgRight!='' ) {
			$im2=imageresize($this->imgRight,0,11);
			//right
			imageCopyMerge($imButton, $im2, 78-imagesx($im2), 2, 0, 0, imagesx($im2), imagesy($im2),100);
		}

		return $imButton;
	}

	function getButton() {
		return $this->imButton;
	}

	function setOuterBorder($aValue) {
		if ($aValue!='') $this->outerBorder=$aValue;
	}

	function setInnerBorder($aValue) {
		if ($aValue!='') $this->innerBorder=$aValue;
	}

	function setBarPosition($aValue) {
		if ($aValue!='') $this->barPosition=intval($aValue);
	}

	function setLeftFill($aValue) {
		if ($aValue!='') $this->leftFill=$aValue;
	}

	function setLeftText($aValue) {
		if ($aValue!='') $this->leftText=rawurlencode(stripslashes($aValue));
	}

	function setLeftTextColor($aValue) {
		if ($aValue!='') $this->leftTextColor=$aValue;
	}

	function setLeftTextPosition($aValue) {
		if ($aValue!='') $this->leftTextPosition=intval($aValue);
	}

	function setRightFill($aValue) {
		if ($aValue!='') $this->rightFill=$aValue;
	}

	function setRightText($aValue) {
		if ($aValue!='') $this->rightText=rawurlencode(stripslashes($aValue));
	}

	function setRightTextColor($aValue) {
		if ($aValue!='') $this->rightTextColor=$aValue;
	}

	function setRightTextPosition($aValue) {
		if ($aValue!='') $this->rightTextPosition=intval($aValue);
	}

	function setFontName($aValue) {
		if ($aValue!='') $this->fontName=$aValue;
	}

	// file name or URL
	function setImgLeft($aFileName) {
		$this->imgLeft=$aFileName;
	}

	// file name or URL
	function setImgRight($aFileName) {
		$this->imgRight=$aFileName;
	}

}
?>
