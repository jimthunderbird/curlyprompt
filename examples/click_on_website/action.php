<?php

require_once 'vendor/autoload.php';

use Symfony\Component\Panther\Client;

class Browser
{
    public static function load($url)
    {
        $client = Client::createChromeClient();
        // alternatively, create a Firefox client
        // $client = Client::createFirefoxClient();
        $client->request('GET', $url);
        $client->clickLink('Getting started');
        // wait for an element to be present in the DOM, even if hidden
        $crawler = $client->waitFor('#bootstrapping-the-core-library');
        // you can also wait for an element to be visible
        $crawler = $client->waitForVisibility('#bootstrapping-the-core-library');
        // get the text of an element thanks to the query selector syntax
        echo $crawler->filter('div:has(> #bootstrapping-the-core-library)')->text();
        // take a screenshot of the current page
        $client->takeScreenshot('screen.png');
    }
}

class App
{
    public static function init()
    {
        // set up php composer for lazy loading
        $url = "https://api-platform.com";
        Browser::load($url);
    }
}

App::init();

