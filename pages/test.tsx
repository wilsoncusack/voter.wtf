export default function Test() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto">
        <div className="flex justify-between">
          <div className="w-1/2 mr-6">
            <div className="bg-white p-6 rounded-lg mb-6">
              <h2 className="font-bold">Vote Reason 1</h2>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </div>
            <div className="bg-white p-6 rounded-lg mb-6">
              <h2 className="font-bold">Vote Reason 2</h2>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </div>
          </div>
          <div className="w-1/2 flex justify-center">
            <div className="w-1/2">
              <div className="bg-white p-6 border border-gray-300">
                <h2 className="font-bold">Proposal 1</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              </div>
              <div className="bg-white p-6 border-t-0 border border-gray-300">
                <h2 className="font-bold">Proposal 2</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              </div>
              <div className="bg-white p-6 border-t-0 border border-gray-300">
                <h2 className="font-bold">Proposal 3</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
