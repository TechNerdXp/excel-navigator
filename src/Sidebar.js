import React from 'react';
import { Switch } from '@headlessui/react';

export default function Sidebar({ isOpen, excludeDuplicates, setExcludeDuplicates, excludeProductNotAvailable, setExcludeProductNotAvailable, excludePriceOnRequest, setExcludePriceOnRequest, excludeCategories, setExcludeCategories, excludeExistingProducts, setExcludeExistingProducts, excludeProductsWithDefaultImage, setExcludeProductsWithDefaultImage, excludeProductsWithNoImage, setExcludeProductsWithNoImage }) {
    return (
        <div className={`flex flex-col justify-center fixed right-0 top-[20vh] w-90 bg-white text-gray-800 transition-transform duration-200 ease-in-out shadow-lg ${isOpen ? 'transform translate-x-0' : 'transform translate-x-full'}`}>
            <h1 className="text-2xl font-extrabold p-5">Filters</h1>
            <nav className="p-5">
                <Switch.Group as="div" className="flex items-center space-x-4">
                    <Switch
                        checked={excludeDuplicates}
                        onChange={setExcludeDuplicates}
                        className={`${excludeDuplicates ? 'bg-blue-600' : 'bg-gray-200'
                            } relative inline-flex items-center h-6 rounded-full w-11`}
                    >
                        <span className="sr-only">Exclude Duplicates</span>
                        <span
                            className={`${excludeDuplicates ? 'translate-x-6' : 'translate-x-1'
                                } inline-block w-4 h-4 transform bg-white rounded-full`}
                        />
                    </Switch>
                    <Switch.Label>Exclude Duplicates</Switch.Label>
                </Switch.Group>
                <Switch.Group as="div" className="flex items-center space-x-4 mt-4">
                    <Switch
                        checked={excludeProductNotAvailable}
                        onChange={setExcludeProductNotAvailable}
                        className={`${excludeProductNotAvailable ? 'bg-blue-600' : 'bg-gray-200'
                            } relative inline-flex items-center h-6 rounded-full w-11`}
                    >
                        <span className="sr-only">Exclude Product Not Available</span>
                        <span
                            className={`${excludeProductNotAvailable ? 'translate-x-6' : 'translate-x-1'
                                } inline-block w-4 h-4 transform bg-white rounded-full`}
                        />
                    </Switch>
                    <Switch.Label>Exclude Product Not Available</Switch.Label>
                </Switch.Group>
                <Switch.Group as="div" className="flex items-center space-x-4 mt-4">
                    <Switch
                        checked={excludePriceOnRequest}
                        onChange={setExcludePriceOnRequest}
                        className={`${excludePriceOnRequest ? 'bg-blue-600' : 'bg-gray-200'
                            } relative inline-flex items-center h-6 rounded-full w-11`}
                    >
                        <span className="sr-only">Exclude Price On Request</span>
                        <span
                            className={`${excludePriceOnRequest ? 'translate-x-6' : 'translate-x-1'
                                } inline-block w-4 h-4 transform bg-white rounded-full`}
                        />
                    </Switch>
                    <Switch.Label>Exclude Price On Request</Switch.Label>
                </Switch.Group>
                <Switch.Group as="div" className="flex items-center space-x-4 mt-4">
                    <Switch
                        checked={excludeCategories}
                        onChange={setExcludeCategories}
                        className={`${excludeCategories ? 'bg-blue-600' : 'bg-gray-200'
                        } relative inline-flex items-center h-6 rounded-full w-11`}
                    >
                        <span className="sr-only">Exclude Categories</span>
                        <span
                            className={`${excludeCategories ? 'translate-x-6' : 'translate-x-1'
                                } inline-block w-4 h-4 transform bg-white rounded-full`}
                        />
                    </Switch>
                    <Switch.Label>Exclude Used Parts</Switch.Label>
                </Switch.Group>
                <Switch.Group as="div" className="flex items-center space-x-4 mt-4">
                    <Switch
                        checked={excludeExistingProducts}
                        onChange={setExcludeExistingProducts}
                        className={`${excludeExistingProducts ? 'bg-blue-600' : 'bg-gray-200'
                            } relative inline-flex items-center h-6 rounded-full w-11`}
                    >
                        <span className="sr-only">Exclude Existing Products</span>
                        <span
                            className={`${excludeExistingProducts ? 'translate-x-6' : 'translate-x-1'
                                } inline-block w-4 h-4 transform bg-white rounded-full`}
                        />
                    </Switch>
                    <Switch.Label>Exclude Existing Products</Switch.Label>
                </Switch.Group>
                <Switch.Group as="div" className="flex items-center space-x-4 mt-4">
                    <Switch
                        checked={excludeProductsWithDefaultImage}
                        onChange={setExcludeProductsWithDefaultImage}
                        className={`${excludeProductsWithDefaultImage ? 'bg-blue-600' : 'bg-gray-200'
                            } relative inline-flex items-center h-6 rounded-full w-11`}
                    >
                        <span className="sr-only">Exclude Products With Default Image</span>
                        <span
                            className={`${excludeProductsWithDefaultImage ? 'translate-x-6' : 'translate-x-1'
                                } inline-block w-4 h-4 transform bg-white rounded-full`}
                        />
                    </Switch>
                    <Switch.Label>Exclude Products With Default Image</Switch.Label>
                </Switch.Group>
                <Switch.Group as="div" className="flex items-center space-x-4 mt-4">
                    <Switch
                        checked={excludeProductsWithNoImage}
                        onChange={setExcludeProductsWithNoImage}
                        className={`${excludeProductsWithNoImage ? 'bg-blue-600' : 'bg-gray-200'
                            } relative inline-flex items-center h-6 rounded-full w-11`}
                    >
                        <span className="sr-only">Exclude Products With No Image</span>
                        <span
                            className={`${excludeProductsWithNoImage ? 'translate-x-6' : 'translate-x-1'
                                } inline-block w-4 h-4 transform bg-white rounded-full`}
                        />
                    </Switch>
                    <Switch.Label>Exclude Products With No Image</Switch.Label>
                </Switch.Group>
            </nav>
        </div>
    );
}
