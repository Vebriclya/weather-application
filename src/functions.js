function addDiv(className, appendThis){
    const sectionName = document.createElement('div');
    sectionName.className = className;
    appendThis.appendChild(sectionName);

    return sectionName;
}