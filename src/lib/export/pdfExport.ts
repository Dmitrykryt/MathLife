export async function exportResultToPdf(title: string, body: string) {
 const content = title + '\n\n' + body
 const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
 const url = URL.createObjectURL(blob)
 const a = document.createElement('a')
 a.href = url
 a.download = 'mathlife-result.txt'
 a.click()
 URL.revokeObjectURL(url)
}
