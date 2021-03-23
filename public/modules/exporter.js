export const exportToPng = (buffer,state,width,height,name) => {
    buffer.save(buffer, name, 'png')
}