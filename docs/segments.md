# Map segments used in brouter

## Purpose

Map segments are essential for brouter to work as it uses them for navigation. The only other data
brouter uses are travel profiles which influence paths brouter chooses.

## Data source

All map segment files can be found at [brouter.de](http://brouter.de/brouter/segments4/)

Segment files are named by the coordinates they cover. First portion denotes the longitude of the
western edge, second portion denotes the latitude of the southern edge. Each segment covers a
"rectangle" sized 5° by 5°.

For example, file `E0_N10.rd5` covers a portion between 10°N, 15°N, 0°E and 5°E

## This project

Segments used in this project include only Poland, and they are as follows:
- E10_N50.rd5
- E15_N45.rd5
- E15_N50.rd5
- E20_N45.rd5
- E20_N50.rd5

Added together they cover the whole country:

![Poland segment coverage](segments.png?raw=True "Poland segments coverage")