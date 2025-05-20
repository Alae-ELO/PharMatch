{/* Contact Modal */}
      {showContactModal && selectedRequest && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative p-8 border w-96 shadow-lg rounded-md bg-white"
          >
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-lg text-gray-700 mb-2"><strong>Hospital:</strong> {selectedRequest.hospital}</p>
                <p className="text-lg text-gray-700 mb-2"><strong>Blood Type Needed:</strong> {selectedRequest.bloodType}</p>
                <p className="text-lg text-gray-700 mb-4"><strong>Contact:</strong> {selectedRequest.contactInfo}</p>
                <p className="text-sm text-gray-600">Please contact the hospital directly if you are able to donate.</p>
              </div>
              <div className="flex justify-center mt-6">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowContactModal(false);
                    setSelectedRequest(null);
                  }}
                >
                  Close
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}