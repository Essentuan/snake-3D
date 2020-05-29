//By Nathan Clisby - his demo for this can be found here: (https://clisby.net/projects/hamiltonian_path/). I modified his original script (Removed all of the comments and unnecessary functions) to turn it into a constructer
function hamiltonianCircuit(maxWidth, maxHeight, quality=1) {
    let path = []
    var xmax = maxWidth-1;
    var ymax = maxHeight-1;
    var n = (xmax+1)*(ymax+1);
    var left_end = true;
    var must_fill = true;
    var showTraceMode = 0;
    var nShowTraceModes = 3;
    var leftTrace = [];
    var nLeftTrace = 0;
    var rightTrace = [];
    var nRightTrace = 0;
    function inSublattice(x, y)
    {
        if (x<0) return false;
        if (x>xmax) return false;
        if (y<0) return false;
        if (y>ymax) return false;
        return true;
    }
  
    function reversePath(i1,i2,path)
    {
        var i;
        var jlim = (i2-i1+1)/2;
        var temp;
        for (j=0; j<jlim; j++)
        {
            temp = path[i1+j];
            path[i1+j] = path[i2-j];
            path[i2-j] = temp;
        }
    }
    function backbite_left(step,n,path)
    {
        var neighbour = [path[0][0] + step[0],path[0][1] + step[1]];
        if (inSublattice(neighbour[0],neighbour[1]))
        {
            var inPath = false;
            for (j=1; j<n; j+=2)
            {
                if ((neighbour[0] == path[j][0]) && (neighbour[1] == path[j][1]))
                {
                    inPath = true;
                    break;
                }
            }
            if (inPath)
            {
                reversePath(0,j-1,path);
            }
            else
            {
                left_end = !left_end;
                reversePath(0,n-1,path);
                n++;
                path[n-1] = neighbour;
            }
        }
        if (showTraceMode == 1)
        {
            leftTrace[nLeftTrace] = path[0]
            nLeftTrace++;
        }
        return n;
    }
    function backbite_right(step,n,path)
    {
        var neighbour = [path[n-1][0] + step[0],path[n-1][1] + step[1]];
        if (inSublattice(neighbour[0],neighbour[1]))
        {
                var inPath = false;
            for (j=n-2; j>=0; j-=2)
            {
                    if ((neighbour[0] == path[j][0]) && (neighbour[1] == path[j][1]))
                    {
                        inPath = true;
                        break;
                    }
            }
            if (inPath)
            {
                reversePath(j+1,n-1,path);
            }
            else
            {
                n++;
                path[n-1] = neighbour;
            }
        }
        if (showTraceMode == 1)
        {
            rightTrace[nRightTrace] = path[n-1]
            nRightTrace++;
        }
        return n;
    }
    function backbite(n,path)
    {
        var step;
        switch (Math.floor(Math.random()*4))
        {
            case 0:
                step = [1,0];
                break;
            case 1:
                step = [-1,0];
                break;
            case 2:
                step = [0,1];
                break;
            case 3:
                step = [0,-1];
                break;
        }
        if (Math.floor(Math.random()*2) == 0)
        {
            n = backbite_left(step,n,path);
        }
        else
        {
            n = backbite_right(step,n,path);
        }
        return n;
    }
  
    function path_to_string(n,path)
    {
        var i;
        var path_string = "[["+path[0]+"]";
        for (i=1; i<n; i++)
        {
            path_string = path_string + ",[" + path[i] + "]";
        }
  
        path_string += "]";
        return(path_string);
    }
  
    function generate_hamiltonian_path(q)
    {
        path[0] = [Math.floor(Math.random()*(xmax+1)),
        Math.floor(Math.random()*(ymax+1))];
        n = 1;
        if (must_fill)
        {
        nattempts = 1 + q*10.0 * (xmax+1) * (ymax+1) * Math.pow(Math.log(2.+(xmax+1)*(ymax+1)),2);
        while (n < (xmax+1)*(ymax+1))
        {
            for (i=0; i<nattempts; i++)
            {
                n = backbite(n,path);
            }
        }
    }
    else
    {
        nattempts = q*10.0 * (xmax+1) * (ymax+1) * Math.pow(Math.log(2.+(xmax+1)*(ymax+1)),2);
            for (i=0; i<nattempts; i++)
            {
                n = backbite(n,path);
            }
    }
        return [n,path];
    }
  
    function generate_hamiltonian_circuit(q)
    {
        result = generate_hamiltonian_path(q);
        var n = result[0];
        var path = result[1];
        var nmax = xmax*ymax;
        var success;
        var min_dist = 1 + (n % 2);
        while (Math.abs(path[n-1][0] - path[0][0])
              + Math.abs(path[n-1][1] - path[0][1]) != min_dist)
        {
            n = backbite(n,path);
        }
        return [n,path];
    }
    let done = generate_hamiltonian_circuit(quality)
    this.path = done[1]
    this.pathLength = done[0]
  }