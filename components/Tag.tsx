function Tag({ text }: { text: string }) {
  return (
    <div className="inline-block relative z-10 rounded-full bg-gray-100 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-200">
      {text}
    </div>
  )
}

export default Tag
