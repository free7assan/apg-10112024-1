import JSZip from 'jszip';

export async function downloadPlaybook(
  content: string | Record<string, string>,
  structure: 'single' | 'multi',
  name: string
): Promise<void> {
  if (structure === 'single') {
    // Download single file
    const blob = new Blob([content as string], { type: 'text/yaml' });
    downloadBlob(blob, `${formatFileName(name)}.yml`);
  } else {
    // Download multiple files as zip
    const zip = new JSZip();
    const files = content as Record<string, string>;
    
    Object.entries(files).forEach(([path, content]) => {
      zip.file(path, content);
    });
    
    const blob = await zip.generateAsync({ type: 'blob' });
    downloadBlob(blob, `${formatFileName(name)}.zip`);
  }
}

function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function formatFileName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}