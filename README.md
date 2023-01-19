# Rivet
Connect your form to Ratufa


## version history

### 1.0.16
* can handle multiple forms that are connected to Ratufa
Sample code to connect another form 
```html
<script>
window.addEventListener("load", function() {
    window.RatufaContainer.loadForm({
        clientFormID: "bottom_form",
        ratufaFormID: "vh2z91q5",
        nodeDomain: "localhost:4121"
    })
});
</script>
```