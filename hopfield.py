import numpy as np
import matplotlib.pyplot as plt
from patterns import *

fig = plt.figure()

def createWeightedMatrix(pattern):
    patternFlatten = patternToFlattenMatrix(pattern) #matrix into column vector [1,1,1,...,1] with 0 replaced by -1
    patternColumn = patternFlatten.transpose() #row vector [[1],[1],...,[1]]
    weightedMatrix = patternFlatten * patternColumn
    np.fill_diagonal(weightedMatrix,0) #replace diagonal of matrix with 0
    return weightedMatrix

def patternToFlattenMatrix(pattern):
    pattern = np.array(pattern)
    patternFlatten = pattern.reshape(1, pattern.data.shape[0]*pattern.data.shape[1])
    patternFlatten[patternFlatten == 0] = -1
    return patternFlatten

def recoverySynch(weightedMatrix, inputMatrix, matrixRows, matrixColumns): #synchronous recovery
    ax3 = fig.add_subplot(2,2,3)
    ax3.imshow(weightedMatrix)
    recoveredMatrix = weightedMatrix @ inputMatrix #multiply whole weighted matrix with damaged image
    recoveredMatrix = np.reshape(recoveredMatrix,(matrixRows, matrixColumns))
    return np.sign(recoveredMatrix)

def recoveryAsynch(weightedMatrix, inputMatrix, matrixRows, matrixColumns):
    ax3 = fig.add_subplot(2,2,3)
    ax3.imshow(weightedMatrix)
    runLoop = True;
    columnsArray = np.arange(inputMatrix.data.shape[1]) #array of numbers of weightedMatrix columns
    checkArray = np.arange(inputMatrix.data.shape[1]) #array for check if everycolumn was calculated
    count = 0
    while(runLoop):
        #select random column from weighted matrix
        randColumn = np.random.choice(columnsArray)
        checkArray = np.delete(checkArray, np.argwhere(checkArray == randColumn)) #column was used
        column = weightedMatrix[:,randColumn] #column from weightedMatrix
        column = column.reshape(1,inputMatrix.data.shape[1]).transpose()
        #input matrix is already flatten so just multiply
        xr = np.sign(inputMatrix @ column)
        #in repaired image replace value at position of used column from weighted matrix
        inputMatrix[0][randColumn] = xr
        if(len(checkArray) <= 0 or count >= 120): #endloop when all columns was used or the iteration count is >= 120
            runLoop = False
        count += 1
    recoveredMatrix = np.reshape(inputMatrix,(matrixRows, matrixColumns))
    return recoveredMatrix




wMat1 = createWeightedMatrix(pattern1) #create weighted matrix for pattern (image)
wMat2 = createWeightedMatrix(pattern2)
wMat3 = createWeightedMatrix(pattern3)
sumWMat = wMat1 + wMat2 + wMat3 #save more patterns into weighted matrix

def run():
    patternTesting = pattern1_d1 #tested pattern
    patternExpected = pattern1 #original pattern
    ax1 = fig.add_subplot(2,2,1)
    ax1.imshow(patternTesting)
    ax4 = fig.add_subplot(2,2,4)
    ax4.imshow(patternExpected)

    input = patternToFlattenMatrix(patternTesting) #from input matrix make input column vector
    rows = len(patternTesting) #rows of image
    columns = len(patternTesting[0]) #columns of image
    #recovered = recoverySynch(sumWMat, input[0], rows, columns)
    recovered = recoveryAsynch(sumWMat, input, rows, columns)
    ax2 = fig.add_subplot(2,2,2)
    ax2.imshow(recovered)
    plt.show()

run()
