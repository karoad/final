Final Project - Interactive Data Visualization  
===

[Link to our vis](https://final-dataviz.herokuapp.com/project5)
[Link to our screencast](https://www.youtube.com/watch?v=reC60_Ei_AE&ab_channel=LucasFernandes)
[Link to process book](https://docs.google.com/document/d/1resK3vFESY57gr2kFaUK3E77DgP7YR-QjTMAjZ27uE0/edit?usp=sharing)

**Explanation of features:**
For Labor statistics:
  - Highlighting a line will show the year as text above the vis
  - Choose the vis you want to look at from the dropdown above the vis
  - The text below the vis updates depending on which vis you have selected

For Case Study:  
The independent restaurant case study visualization contains an interactive map. Users can pan around and zoom in and out of the map. Additionally, dots cover the map representing restaurants. The user can click a dot to generate two bar graphs representing the sales and the number of meals served in the restaurant. The bars will animate from their old position to the new one. The clicked restaurant dot will turn red, so the user can visually identify which restaurant they currently have selected. Upon hovering over unselected restaurant dots, the color will become darker and the restaurant's name will appear in a tooltip. The space above the bar graphs will contain the currently selected restaurant's name, city and state.

For Seated Diners Choropleth Map:
The dropdown allows the users to select the date of the first of the month starting May 1st 2020, and then everyday in March 2021. Selecting a date will highlight the maps a color corresponding to how many of the seated diners in that state were accepting reservations that day. 


Our code is mostly our own, and what we did not come up with ourselves is referenced below

**References and Libraries utilized**
---

- [Gradient legend](https://bl.ocks.org/HarryStevens/6eb89487fc99ad016723b901cbd57fde)
- [Professor Harrison's code for making maps in d3](https://wpi0-my.sharepoint.com/:u:/g/personal/ltharrison_wpi_edu/ESyRc5olk4FDsk9bdV7VDVsBCUCRoTbzyPnZ7zipJC2t0w?e=rkzWgs)
- [Creating color palettes](https://coolors.co/gradient-palette/d5ded9-11c411?number=5)
- [source reference for labor chart](https://www.d3-graph-gallery.com/graph/line_basic.html)


