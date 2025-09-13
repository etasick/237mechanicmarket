<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
    exclude-result-prefixes="sitemap">
  
  <xsl:output method="html" indent="yes"/>

  <!-- Match the root element -->
  <xsl:template match="/">
    <html>
      <head>
        <title>Sitemap</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
          }
          a {
            text-decoration: none;
            color: #1a73e8;
          }
          a:hover {
            text-decoration: underline;
          }
          .url {
            margin-bottom: 10px;
            display: block;
          }
        </style>
      </head>
      <body>
        <h1>Sitemap</h1>
        <!-- Loop through the <url> elements -->
        <xsl:for-each select="sitemap:urlset/sitemap:url">
          <a href="{sitemap:loc}" class="url">
            <xsl:value-of select="sitemap:loc"/>
          </a>
        </xsl:for-each>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
