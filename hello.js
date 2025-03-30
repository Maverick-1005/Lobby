const logMessage = () => () => {
    console.log("hello kya haal")
}
 const inner =  logMessage()
 inner()