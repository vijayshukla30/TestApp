export async function uploadToS3(uploadUrl: string, fileUri: string) {
  const res = await fetch(fileUri);
  const blob = await res.blob();

  const uploadRes = await fetch(uploadUrl, {
    method: "PUT",
    headers: {},
    body: blob,
  });

  if (!uploadRes.ok) {
    const text = await uploadRes.text();
    console.error("S3 PUT failed:", uploadRes.status, text);
    throw new Error("S3 upload failed");
  }

  return blob.size;
}
