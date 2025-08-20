import React from 'react'

function CustomLoading({loading}) {
    if (!loading) return null;

    return (
        <div className="fixed inset-0 bg-white bg-opacity-95 z-50 flex items-center justify-center">
            <div className="flex flex-col items-center space-y-6">
                {/* Spinner igual ao do dashboard */}
                <div className="relative">
                    <div className="w-8 h-8 border-2 border-gray-200 rounded-full animate-spin"></div>
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                </div>
                
                {/* Texto */}
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        Redesenhando seu ambiente...
                    </h2>
                    <p className="text-gray-600">
                        Não atualize a página
                    </p>
                </div>
            </div>
        </div>
    )
}

export default CustomLoading