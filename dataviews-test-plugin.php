<?php
/*
 * Plugin Name:       DataViews Test Plugin
 * Description:       DataViews Test Plugin
 * Version:           1.0.0
 * Requires at least: 6.6
 * Requires PHP:      8.2
 * Author:            Charlie Merland
 * License:           GPL v2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action( 'admin_menu', function() {
    add_menu_page( 'dataviews-test-plugin', 'DataViews Test Plugin', 'manage_options', 'dataviews-test-plugin', function () {
        echo '<div class="wrap"><h1>DataViews Test Plugin</h1><div id="dataviews-test"></div></div>';
    } );
} );

add_action( 'admin_enqueue_scripts', function( $hook_suffix ) {
    if ( 'toplevel_page_dataviews-test-plugin' === $hook_suffix ) {
        $assets = require plugin_dir_path( __FILE__ ) . 'build/index.asset.php';
        wp_enqueue_script( 'dataviews-test-plugin', plugin_dir_url( __FILE__ ) . 'build/index.js', $assets['dependencies'], '1.0.0', true );
        wp_enqueue_style( 'wp-edit-site' );
    }
} );